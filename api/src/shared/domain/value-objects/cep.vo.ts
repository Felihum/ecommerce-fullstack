
export class CEP {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): CEP {
    if (!value || !value.trim()) {
      throw new Error("CEP cannot be empty.");
    }

    const normalizedCEP = value.replace(/\D/g, "");

    if (!this.isValid(normalizedCEP)) {
      throw new Error("Invalid CEP.");
    }

    return new CEP(normalizedCEP);
  }

  private static isValid(value: string): boolean {
    return /^\d{8}$/.test(value);
  }

  public get value(): string {
    return this._value;
  }

  public get formatted(): string {
    return this._value.replace(
      /^(\d{5})(\d{3})$/,
      "$1-$2"
    );
  }

  public equals(cep: CEP): boolean {
    return this._value === cep.value;
  }

  public toString(): string {
    return this._value;
  }
}
