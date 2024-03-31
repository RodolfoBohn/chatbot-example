import { IMaintenanceProps } from 'src/@types/types';

export abstract class MaintenanceServiceRequestRepository {
  abstract addNewServiceRequest(
    userId: string,
    ticketId: number,
    scheduledDate: Date,
  ): Promise<void>;

  abstract getAllScheduledBetweenDates(
    initialDate: Date,
    finishedDate: Date,
  ): Promise<IMaintenanceProps[]>;

  abstract finbByScheduledDate(date: Date): Promise<IMaintenanceProps | null>;
}
