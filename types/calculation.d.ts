export type CalculationResult = {
  result: string;
}

export type CalculationHistory = {
  history: CalculationRecord[];
}

export type CalculationRecord = {
  id: string;
  userId: string;
  expression: string;
  result: string;
  createdAt: Date;
}

export type ErrorResponse = {
  error: string;
}

export type SuccessMessage = {
  message: string;
}

export type CalculationRequest = {
  expression: string;
  userId?: string;
}