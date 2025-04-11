import { CalculationRecord } from "../../types";

export interface ICalculationAdapter {
    create(data: {
        userId: string;
        expression: string;
        result: string;
    }): Promise<CalculationRecord>;
    findHistoryByUserId(userId: string): Promise<CalculationRecord[]>;
    clearHistoryByUserId(userId: string): Promise<unknown>;
}
