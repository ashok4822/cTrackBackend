import dotenv from 'dotenv';
dotenv.config();


export const appConfig = {
    pda: {
        lowBalanceThreshold: Number(process.env.LOW_PDA_BALANCE_THRESHOLD) || 10000
    }
};
