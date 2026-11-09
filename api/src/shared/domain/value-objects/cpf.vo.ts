
export class CPF {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): CPF {
    if (!value || !value.trim()) {
      throw new Error("CPF cannot be empty.");
    }

    const normalizedCPF = value.replace(/\D/g, "");

    if (!this.isValid(normalizedCPF)) {
      throw new Error("Invalid CPF.");
    }

    return new CPF(normalizedCPF);
  }

  private static isValid(value: string): boolean {
    // CPF must contain exactly 11 digits.
    if (!/^\d{11}$/.test(value)) {
      return false;
    }

    // Reject sequences with repeated digits.
    if (/^(\d)\1{10}$/.test(value)) {
      return false;
    }

    const digits = value.split("").map(Number);

    const firstDigit = this.calculateDigit(digits.slice(0, 9));
    const secondDigit = this.calculateDigit(digits.slice(0, 10));

    return (
      firstDigit === digits[9] &&
      secondDigit === digits[10]
    );
  }

  private static calculateDigit(digits: number[]): number {
    const weight = digits.length + 1;

    const sum = digits.reduce(
      (accumulator, digit, index) =>
        accumulator + digit * (weight - index),
      0
    );

    const remainder = (sum * 10) % 11;

    return remainder === 10 ? 0 : remainder;
  }

  public get value(): string {
    return this._value;
  }

  public get formatted(): string {
    return this._value.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4"
    );
  }

  public equals(cpf: CPF): boolean {
    return this._value === cpf.value;
  }

  public toString(): string {
    return this._value;
  }
}
