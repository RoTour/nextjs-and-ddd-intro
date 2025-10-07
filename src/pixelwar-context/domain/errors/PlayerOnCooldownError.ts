import { DomainError } from "../../../shared-kernel/errors/DomainError";

export class PlayerOnCooldownError extends DomainError {
  public readonly cooldownRemaining: number;

  constructor(cooldownRemaining: number) {
    const secondsRemaining = (cooldownRemaining / 1000).toFixed(1);
    // Call the parent constructor with the message
    super(`Player is on cooldown. Please wait ${secondsRemaining} seconds.`);

    this.cooldownRemaining = cooldownRemaining;
  }
}
