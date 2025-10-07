import * as bcrypt from "bcrypt";

export interface PasswordPrimitive {
  hashedPassword: string;
}

export class Password {
  private readonly hashedValue: string;

  get value(): string {
    return this.hashedValue;
  }

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  public static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  public static async fromClear(plainPassword: string): Promise<Password> {
    const hashedValue = await this.hashValue(plainPassword);
    return new Password(hashedValue);
  }

  private static async hashValue(value: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(value, salt);
  }

  public async compare(clearPassword: string): Promise<boolean> {
    return bcrypt.compare(clearPassword, this.hashedValue);
  }

  public toPrimitives(): PasswordPrimitive {
    return {
      hashedPassword: this.hashedValue,
    };
  }
}
