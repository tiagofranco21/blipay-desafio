export interface Loan {
  name: string;
  age: number;
  monthlyIncome: number;
  city: string;
  cpf: string;
  score?: number;
  approved?: boolean;
}

export interface LoanResponse {
  score: number;
  approved: boolean;
}

export interface LoanResponseError {
  errors: Record<string, string>;
  message: string;
}
