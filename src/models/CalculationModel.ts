import { PrismaCalculationAdapter } from "../adapters/PrismaCalculationAdapter";
import { ICalculationAdapter } from "../adapters/interfaces/ICalculationAdapter";

export const CalculationModel: ICalculationAdapter =
    new PrismaCalculationAdapter();
