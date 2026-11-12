import { PasswordHasherInterface } from "@modules/auth/domain/contracts/password.hasher.interface";
import * as argon2 from "argon2";

export class Argon2Hasher implements PasswordHasherInterface {
  async encrypt(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  }

  async compare(input: string, target: string): Promise<boolean> {
    try {
      return await argon2.verify(target, input);
    } catch {
      return false;
    }
  }
}
