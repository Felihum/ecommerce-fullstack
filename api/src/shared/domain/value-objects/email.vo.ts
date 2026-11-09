export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Email {
    if (!value || !value.trim()) {
      throw new Error("Email cannot be empty.");
    }

    const normalizedEmail = value.trim().toLowerCase();

    if (!this.isValid(normalizedEmail)) {
      throw new Error("Invalid email address.");
    }

    return new Email(normalizedEmail);
  }

  private static isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(email: Email): boolean {
    return this._value === email.value;
  }

  public toString(): string {
    return this._value;
  }
}
