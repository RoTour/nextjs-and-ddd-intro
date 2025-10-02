import { CellColorChanged } from "@/domain/CellColorChanged.event";
import { IDomainEvent } from "@/domain/common/interfaces/IDomainEvent";
import { IDomainEventListener } from "@/domain/common/interfaces/IDomainEventListener";
import z from "zod";

export const ClientEventGridUpdatedPayload = z.object({
  gridId: z.string(),
  playerId: z.string(),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  newColor: z.string(),
});

export class GridUpdateBroadcaster implements IDomainEventListener {
  constructor(
    private readonly broadcaster: (stringifiedPayload: string) => void,
  ) {}
  handle(event: IDomainEvent): void {
    console.debug("GridUpdateBroadcaster: Event received");
    if (!(event instanceof CellColorChanged)) return;
    console.log("GridUpdateBroadcaster: Handling CellColorChanged event...");

    const messageToBroadcast = {
      type: "GRID_UPDATED",
      payload: {
        gridId: event.gridId.id(),
        playerId: event.playerId.id(),
        x: event.x,
        y: event.y,
        newColor: event.newColor,
      },
    };

    this.broadcaster(JSON.stringify(messageToBroadcast));
  }
}
