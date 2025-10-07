import { IDomainEvent } from "@/shared-kernel/interfaces/IDomainEvent";
import { UserId } from "./UserId.valueObject";

export class UserCreated implements IDomainEvent {
  occuredOn: Date;
  constructor(public readonly userId: UserId) {
    this.occuredOn = new Date();
  }
}
