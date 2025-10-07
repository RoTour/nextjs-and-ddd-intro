import { CellColorChanged } from "@/pixelwar-context/domain/CellColorChanged.event";
import { IDomainEvent } from "@/shared-kernel/interfaces/IDomainEvent";
import { IDomainEventListener } from "@/shared-kernel/interfaces/IDomainEventListener";
import z from "zod";
import { IBroadcaster } from "../broadcasting/IBroadcaster";

export const ClientEventGridUpdatedPayload = z.object({
  gridId: z.string(),
  playerId: z.string(),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  newColor: z.string(),
});

export class GridUpdateBroadcaster implements IDomainEventListener {
  constructor(private readonly broadcaster: IBroadcaster) {}

  async handle(event: IDomainEvent): Promise<void> {
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

    await this.broadcaster.broadcast(JSON.stringify(messageToBroadcast));
  }
}
