import { EntityId } from "../../shared-kernel/interfaces/EntityId";

export class GridId extends EntityId {
  generateId(): string {
    const uuid = crypto.randomUUID();
    return `GRID-${uuid}`;
  }
}
