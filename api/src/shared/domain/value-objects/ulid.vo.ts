import { ulidGenerator } from "@infrastructure/identity/ulid/ulid.generator";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

export class ULID {
    private constructor(
        private readonly value: string
    ) {}

    static create(): ULID {
        return new ULID(ulidGenerator.generate());
    }

    static from(value: string): ULID {
        if (!value || !ULID_REGEX.test(value.toUpperCase())) {
            throw new Error("Invalid ULID.");
        }

        return new ULID(value.toUpperCase());
    }

    toString(): string {
        return this.value;
    }

    equals(other: ULID): boolean {
        return this.value === other.value;
    }

    getTimestamp(): Date {
        let timestamp = 0n;

        for (let i = 0; i < 10; i++) {
            const index = ALPHABET.indexOf(this.value[i]);

            timestamp = (timestamp << 5n) | BigInt(index);
        }

        return new Date(Number(timestamp));
    }

    compareTo(other: ULID): number {
        return this.value.localeCompare(other.value);
    }
}
