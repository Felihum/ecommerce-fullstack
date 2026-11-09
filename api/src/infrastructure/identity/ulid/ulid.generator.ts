const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const RANDOM_MAX = (1n << 80n) - 1n;
const TIMESTAMP_MAX = (1n << 48n) - 1n;

export class UlidGenerator{
  private lastTimestamp = -1n;
  private lastRandom = 0n;

  generate(): string {
    let timestamp = BigInt(Date.now());

    if (timestamp > TIMESTAMP_MAX) {
      throw new Error("ULID timestamp exceeds the 48-bit limit.");
    }

    if (timestamp > this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.lastRandom = this.generateRandom();
    } else {
      timestamp = this.lastTimestamp;

      if (this.lastRandom === RANDOM_MAX) {
        throw new Error("ULID random component overflow.");
      }

      this.lastRandom++;
    }

    return this.encode(timestamp, this.lastRandom);
  }

  private generateRandom(): bigint {
    const bytes = new Uint8Array(10);

    globalThis.crypto.getRandomValues(bytes);

    let result = 0n;

    for (const byte of bytes) {
      result = (result << 8n) | BigInt(byte);
    }

    return result;
  }

  private encode(timestamp: bigint, random: bigint): string {
    let value = (timestamp << 80n) | random;

    let result = "";

    for (let i = 0; i < 26; i++) {
      const index = Number(value & 31n);

      result = ALPHABET[index] + result;

      value >>= 5n;
    }

    return result;
  }
}

export const ulidGenerator = new UlidGenerator();
