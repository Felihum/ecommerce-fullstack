export class Password {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): Password {
        Password.validate(value);

        return new Password(value);
    }

    private static validate(value: string): void {
        if (typeof value !== "string") {
            throw new Error("Password must be a string.");
        }

        if (value.length < 8) {
            throw new Error(
                "Password must contain at least 8 characters."
            );
        }

        if (!/[A-Z]/.test(value)) {
            throw new Error(
                "Password must contain at least one uppercase letter."
            );
        }

        if (!/[a-z]/.test(value)) {
            throw new Error(
                "Password must contain at least one lowercase letter."
            );
        }

        if (!/[0-9]/.test(value)) {
            throw new Error(
                "Password must contain at least one number."
            );
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            throw new Error(
                "Password must contain at least one special character."
            );
        }
    }

    public toString(): string {
        return this.value;
    }

    public equals(password: Password): boolean {
        return this.value === password.value;
    }
}
