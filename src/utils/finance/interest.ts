
/**
 * Calculate APY based on interest payout and total amount
 * @param reward interest payout reward
 * @param total total balance
 * @param period (optional) payout period
 * @returns percentage
 */
export const calculateApyFromRewardAndTotal = (reward: number, total: number, period?: number) => {
    if (period === undefined) {
        period = 365
    }
    const rate = (reward * period) / total;
    // console.log({ reward, total, rate })
    const interest = rate / period;
    // console.log('rate/period', interest)
    const apy = ((1 + interest) ** period) - 1
    return apy * 100
}