import { IMessageProps } from 'src/@types/types';

export abstract class MessageRepository {
  abstract addNewMessage(
    message: IMessageProps,
    ticketId: number,
  ): Promise<IMessageProps>;
}
