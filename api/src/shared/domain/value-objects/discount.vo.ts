export class Discount {
    private constructor(
        private readonly value: number,
    ) {}

    static create(value: number): Discount {
        if (!Number.isFinite(value)) {
            throw new Error('Discount must be a finite number.');
        }

        if (value < 0 || value > 100) {
            throw new Error('Discount must be between 0 and 100.');
        }

        return new Discount(value);
    }

    getValue(): number {
        return this.value;
    }

    apply(amount: number): number {
        if (!Number.isFinite(amount) || amount < 0) {
            throw new Error('Amount must be a non-negative finite number.');
        }

        return amount * (1 - this.value / 100);
    }

    isZero(): boolean {
        return this.value === 0;
    }

    isEqualTo(other: Discount): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toString()
    }
}
