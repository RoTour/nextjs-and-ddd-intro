import { EntityId } from "@/shared-kernel/interfaces/EntityId";

export class UserId extends EntityId {
  protected generateId(): string {
    const randomUUID = crypto.randomUUID();
    return `user-${randomUUID}`;
  }
}
