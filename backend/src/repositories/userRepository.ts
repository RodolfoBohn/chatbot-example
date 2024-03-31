import { IUserProps } from 'src/@types/types';

export abstract class UserRepository {
  abstract create(): Promise<IUserProps>;

  abstract findByCountId(countId: string): Promise<IUserProps>;
}
