import { Injectable } from '@nestjs/common';
import { TicketRepository } from 'src/repositories/ticketRepository';
import { MessageRepository } from 'src/repositories/messageRepository';
import { CommercialServiceRequestRepository } from 'src/repositories/commercialServiceRequestRepository';
import { MaintenanceServiceRequestRepository } from 'src/repositories/maintenanceServiceRequestRepository';

import * as dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/pt-br';
import { UserRepository } from 'src/repositories/userRepository';
import {
  IMaintenanceProps,
  IMessageProps,
  ITicketProps,
} from 'src/@types/types';

dayjs.locale('pt-br');
dayjs.extend(weekday);

@Injectable()
export class GatewayService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly commercialServiceRequestRepository: CommercialServiceRequestRepository,
    private readonly maintenanceServiceRequestRepository: MaintenanceServiceRequestRepository,
  ) {}

  async manageMessage(
    message: IMessageProps,
    clientCountId: string,
  ): Promise<IMessageProps[]> {
    const userTicket =
      await this.ticketRepository.findActiveByUserCountId(clientCountId);
    const user = await this.userRepository.findByCountId(clientCountId);

    if (!userTicket) {
      const ticket = await this.ticketRepository.create(user.id);
      return ticket.message;
    }
    switch (userTicket.state) {
      case 'INICIADO': {
        const response = await this.managePrimaryMessage(message, userTicket);
        return response;
      }
      case 'AGUARDANDO_CONFIRMACAO_DATA': {
        const response = await this.manageConfirmHour(message, userTicket);
        return response;
      }
    }
  }

  private async managePrimaryMessage(
    message: IMessageProps,
    userTicket: ITicketProps,
  ) {
    if (message.content === '1 - Desejo adquirir um veículo') {
      await this.messageRepository.addNewMessage(message, userTicket.id);

      await this.messageRepository.addNewMessage(
        {
          sender: 'bot',
          content:
            'Muito obrigado! Em breve um de nossos atendentes irá entrar em contato com você.',
        },
        userTicket.id,
      );

      await this.ticketRepository.closeTicket(userTicket.id);

      await this.commercialServiceRequestRepository.addNewServiceRequest(
        userTicket.userId,
        userTicket.id,
      );

      return (await this.ticketRepository.findById(userTicket.id)).message;
    } else if (message.content === '2 - Desejo agendar uma manutenção') {
      await this.messageRepository.addNewMessage(message, userTicket.id);

      const schedule = await this.defineFreeSchedule();

      const responseMessage: IMessageProps = {
        sender: 'bot',
        content: 'Selecione o dia e horário da sua manutenção:',
        MessageOptions: schedule.map((hour) => {
          return {
            value: hour.toDate().toString(),
            optionText: hour.format('DD[ de ]MMMM - HH:mm'),
          };
        }),
      };

      await this.messageRepository.addNewMessage(
        responseMessage,
        userTicket.id,
      );

      await this.ticketRepository.updateTicketStatus(
        userTicket.id,
        'AGUARDANDO_CONFIRMACAO_DATA',
      );

      const ticket = await this.ticketRepository.findById(userTicket.id);

      return ticket.message;
    }
  }

  private async manageConfirmHour(
    message: IMessageProps,
    userTicket: ITicketProps,
  ) {
    await this.messageRepository.addNewMessage(message, userTicket.id);

    const hour = message.value;
    const date = dayjs(hour);

    const isDateScheduled =
      await this.maintenanceServiceRequestRepository.finbByScheduledDate(
        date.toDate(),
      );

    if (isDateScheduled || dayjs(date).isBefore(dayjs())) {
      const schedule = await this.defineFreeSchedule();

      const responseMessage: IMessageProps = {
        sender: 'bot',
        content:
          'Desculpe! Este horário não está mais disponível. Selecione novamente o dia e horário da sua manutenção:',
        MessageOptions: schedule.map((hour) => {
          return {
            value: hour.toDate().toString(),
            optionText: hour.format('DD[ de ]MMMM - HH:mm'),
          };
        }),
      };

      await this.messageRepository.addNewMessage(
        responseMessage,
        userTicket.id,
      );
    } else {
      await this.maintenanceServiceRequestRepository.addNewServiceRequest(
        userTicket.userId,
        userTicket.id,
        date.toDate(),
      );

      await this.messageRepository.addNewMessage(
        {
          sender: 'bot',
          content: `Muito obrigado! Horário agendado ${date.format('DD[ de ]MMMM [ às ] HH:mm')}.`,
        },
        userTicket.id,
      );

      await this.ticketRepository.closeTicket(userTicket.id);
    }

    return (await this.ticketRepository.findById(userTicket.id)).message;
  }

  private async defineFreeSchedule() {
    let baseHour = dayjs();
    let freeSchedule = [];
    let freeScheduleControl = true;

    do {
      let selectedDay =
        baseHour.minute() <= 30
          ? baseHour.set('minute', 30).set('second', 0).set('millisecond', 0)
          : baseHour
              .add(1, 'hour')
              .set('minute', 0)
              .set('second', 0)
              .set('millisecond', 0);
      if (
        baseHour.isAfter(
          dayjs().set('hour', 17).set('minute', 30).set('second', 0),
        )
      ) {
        selectedDay = baseHour
          .add(1, 'day')
          .set('hour', 8)
          .set('minute', 0)
          .set('second', 0)
          .set('millisecond', 0);
      }
      selectedDay = this.excludeWeekendsDays(selectedDay);

      const scheduledMaintenance: Array<IMaintenanceProps> =
        await this.maintenanceServiceRequestRepository.getAllScheduledBetweenDates(
          selectedDay.toDate(),
          selectedDay
            .set('hour', 17)
            .set('minute', 30)
            .set('second', 0)
            .toDate(),
        );

      const vacancyHours = [selectedDay];
      let vacancyHoursControl = 1;
      let breakLoop = false;
      do {
        const hour = selectedDay.add(30 * vacancyHoursControl, 'minute');
        if (hour.get('hour') < 18) {
          vacancyHours.push(hour);
        } else {
          breakLoop = true;
        }
        vacancyHoursControl++;
      } while (!breakLoop);

      const filteredVacancySchedule = vacancyHours.filter(
        (vacancyHour) =>
          !scheduledMaintenance.some((scheduled) => {
            return (
              vacancyHour.toDate().getTime() ===
              scheduled.scheduledDate.getTime()
            );
          }),
      );
      if (filteredVacancySchedule.length === 0) {
        baseHour = baseHour.add(1, 'day');
      } else {
        freeSchedule = [...filteredVacancySchedule];
        freeScheduleControl = false;
      }
    } while (freeScheduleControl);

    return freeSchedule;
  }

  private excludeWeekendsDays(date: dayjs.Dayjs): dayjs.Dayjs {
    if (date.get('day') === 6) {
      return date
        .weekday(8)
        .set('hour', 8)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
    } else if (date.get('day') === 0) {
      return date
        .weekday(1)
        .set('hour', 8)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);
    }

    return date;
  }
}
