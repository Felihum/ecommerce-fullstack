export enum PaymentStatus{
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid',
    EXPIRED = 'expired',
    FAILED = 'failed',
    CANCELED = 'canceled',
    REFUNDED = 'refunded'
}

export class InvalidPaymentTransitionError extends Error {
    constructor(
        public readonly currentStatus: PaymentStatus,
        public readonly targetStatus: PaymentStatus,
    ) {
        super(
            `Invalid payment transition: ${currentStatus} -> ${targetStatus}`
        );

        this.name = 'InvalidPaymentTransitionError';
    }
}

export class PaymentStateMachine {

    private static readonly transitions: Record<
        PaymentStatus,
        readonly PaymentStatus[]
    > = {
        [PaymentStatus.PENDING]: [
            PaymentStatus.PROCESSING,
            PaymentStatus.PAID,
            PaymentStatus.EXPIRED,
            PaymentStatus.FAILED,
            PaymentStatus.CANCELED,
        ],

        [PaymentStatus.PROCESSING]: [
            PaymentStatus.PAID,
            PaymentStatus.EXPIRED,
            PaymentStatus.FAILED,
            PaymentStatus.CANCELED,
        ],

        [PaymentStatus.PAID]: [
            PaymentStatus.REFUNDED,
        ],

        [PaymentStatus.EXPIRED]: [],
        [PaymentStatus.FAILED]: [],
        [PaymentStatus.CANCELED]: [],
        [PaymentStatus.REFUNDED]: [],
    };

    static canTransition(
        current: PaymentStatus,
        target: PaymentStatus,
    ): boolean {
        return this.transitions[current].includes(target);
    }

    static transition(
        current: PaymentStatus,
        target: PaymentStatus,
    ): PaymentStatus {

        if (!this.canTransition(current, target)) {
            throw new InvalidPaymentTransitionError(
                current,
                target,
            );
        }

        return target;
    }

    static getAvailableTransitions(
        current: PaymentStatus,
    ): readonly PaymentStatus[] {
        return this.transitions[current];
    }

    static isFinalState(status: PaymentStatus): boolean {
        return this.transitions[status].length === 0;
    }
}
