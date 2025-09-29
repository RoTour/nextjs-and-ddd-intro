import { EntityId } from "./common/interfaces/EntityId";

export class GridId extends EntityId {
  generateId(): string {
    const uuid = crypto.randomUUID();
    return `GRID-${uuid}`;
  }
}
