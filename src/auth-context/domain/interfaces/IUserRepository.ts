// src/auth-context/domain/interfaces/IUserRepository.ts
import { User } from "../User.entity";
import { UserId } from "../UserId.valueObject";
import { Email } from "../Email.valueObject";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
}
