export class PenaltyStrategy {
    /**
     * @param {{ loan:any, damaged?:boolean, damageAmount?:number }} ctx
     * @returns {{ amount:number, paid:boolean, member:{id:number}, loan:{id:number} } | null}
     */
    compute(ctx) { return null; }
}

export class NoPenaltyStrategy extends PenaltyStrategy {
    compute() { return null; }
}

export class FlatPenaltyStrategy extends PenaltyStrategy {
    compute({ loan, damaged, damageAmount }) {
        if (!damaged || !damageAmount || Number(damageAmount) <= 0) return null;
        return {
            amount: Number(damageAmount),
            paid: false,
            member: { id: loan.member.id },
            loan:   { id: loan.id },
        };
    }
}

export function getPenaltyStrategy({ damaged, damageAmount } = {}) {
    // Política simple: si viene monto => Flat; si no => NoPenalty
    if (damaged && Number(damageAmount) > 0) return new FlatPenaltyStrategy();
    return new NoPenaltyStrategy();
}
