export interface IMessageProps {
  sender: string;
  content: string;
  value?: string;
  MessageOptions?: {
    optionText: string;
    value: string;
  }[];
}

export interface IUserProps {
  id: string;
  countId: string;
}

export interface ITicketProps {
  id: number;
  userId: string;
  state: string;
  message?: IMessageProps[];
}

export interface IMaintenanceProps {
  id: string;
  createdAt: Date;
  scheduledDate: Date;
  userId: string;
  ticketId: number;
}
