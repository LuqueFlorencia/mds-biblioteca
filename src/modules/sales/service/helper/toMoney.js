export const toMoney = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) 
        return 0;
    
    return Number(num.toFixed(2));
};