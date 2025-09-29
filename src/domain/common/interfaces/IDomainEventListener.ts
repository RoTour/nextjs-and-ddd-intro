// /Users/rotour/projects/back-to-react/src/domain/events/IDomainEventListener.ts
import { IDomainEvent } from "../interfaces/IDomainEvent";

export interface IDomainEventListener {
  handle(event: IDomainEvent): void;
}
