import dotenv from "dotenv";
dotenv.config();

export const ENDPOINTS = {
  LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/login`,
  REGISTER_USER: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/createdUser`,

  // Gain
  GAIN_REGISTER: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/createGain`,
  GAIN_LIST: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/gains`,
  GAIN_DETAIL: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/gain`,
  GAIN_UPDATE: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/updateGain`,
  GAIN_DELETE: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/deleteGain`,

  // Expense
  EXPENSE_REGISTER: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/createExpense`,
  EXPENSE_LIST: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/expenses`,
  EXPENSE_DETAIL: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/expense`,
  EXPENSE_UPDATE: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/updateExpense`,
  EXPENSE_DELETE: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/deleteExpense`,
  // Analise
  ANALISE: `${process.env.NEXT_PUBLIC_API_URL}/financeiroMotoboy/analise`

};
