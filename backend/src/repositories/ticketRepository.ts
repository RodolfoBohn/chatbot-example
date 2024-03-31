import { ITicketProps } from 'src/@types/types';

export abstract class TicketRepository {
  abstract create(userId: string): Promise<ITicketProps>;

  abstract findById(ticketId: number): Promise<ITicketProps>;

  abstract findActiveByUserId(userId: string): Promise<ITicketProps>;

  abstract findActiveByUserCountId(countId: string): Promise<ITicketProps>;

  abstract updateTicketStatus(
    ticketId: number,
    status: string,
  ): Promise<ITicketProps>;

  abstract closeTicket(ticketId: number): Promise<ITicketProps>;
}
