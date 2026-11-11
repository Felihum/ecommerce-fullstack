import { TokenHasherInterface } from "@modules/auth/domain/contracts/token.hasher.interfacer";
import { createHash, timingSafeEqual } from "crypto";

export class Sha256Hasher implements TokenHasherInterface {
  encrypt(token: string): string {
    return createHash("sha256")
      .update(token)
      .digest("hex");
  }

  compare(input: string, target: string): boolean {
    const inputHash = Buffer.from(this.encrypt(input), "hex");
    const targetHash = Buffer.from(target, "hex");

    if (inputHash.length !== targetHash.length) {
      return false;
    }

    return timingSafeEqual(inputHash, targetHash);
  }
}