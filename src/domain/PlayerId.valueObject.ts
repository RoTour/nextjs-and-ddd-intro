import { EntityId } from "./interfaces/EntityId";

export class PlayerId extends EntityId {
  protected generateId(): string {
    const uuid = crypto.randomUUID();
    return `PLAYER-${uuid}`;
  }
}
