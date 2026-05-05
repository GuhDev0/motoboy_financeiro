import { GainService } from "./gain.service.js"
import { ExpenseService } from "./expense.service.js";


export class AnaliseService {
    constructor(
        private gainService: GainService = new GainService(),
        private expenseService: ExpenseService = new ExpenseService()
    ) {}    
    async analise(userId: number) {

    const listGains = await this.gainService.getAllGains(userId);
    const listExpenses = await this.expenseService.getAllExpenses(userId);
    
    const gastoDoDia = listExpenses.filter(expense => {
        const dataAtual = new Date();
        const dataDaDespesa = new Date(expense.date);
        return dataAtual.toDateString() === dataDaDespesa.toDateString();
    });
    const ganhoDoDia = listGains.filter(gain => {
        const dataAtual = new Date();
        const dataDoGanho = new Date(gain.date);
        return dataAtual.toDateString() === dataDoGanho.toDateString();
    });
    const ganhoSemanal = listGains.filter(gain => {
        const dataAtual = new Date();
        const dataDoGanho = new Date(gain.date);
        const diffTime = Math.abs(dataAtual.getTime() - dataDoGanho.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    });
    const gastoSemanal = listExpenses.filter(expense => {
        const dataAtual = new Date();
        const dataDaDespesa = new Date(expense.date);
        const diffTime = Math.abs(dataAtual.getTime() - dataDaDespesa.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    });
    const ganhoMensal = listGains.filter(gain => {
        const dataAtual = new Date();
        const dataDoGanho = new Date(gain.date);
        return dataAtual.getMonth() === dataDoGanho.getMonth() &&
               dataAtual.getFullYear() === dataDoGanho.getFullYear();
    });
    const gastoMensal = listExpenses.filter(expense => {
        const dataAtual = new Date();
        const dataDaDespesa = new Date(expense.date);
        return dataAtual.getMonth() === dataDaDespesa.getMonth() &&
               dataAtual.getFullYear() === dataDaDespesa.getFullYear();
    });

    const totalGastoDoDia = gastoDoDia.reduce((total, expense) => total + expense.value, 0);
    const totalGanhoDoDia = ganhoDoDia.reduce((total, gain) => total + gain.value, 0);
    
    const totalGanhoSemanal = ganhoSemanal.reduce((total, gain) => total + gain.value, 0);
    const totalGastoSemanal = gastoSemanal.reduce((total, expense) => total + expense.value, 0);
    
    const totalGanhoMensal = ganhoMensal.reduce((total, gain) => total + gain.value, 0);
    const totalGastoMensal = gastoMensal.reduce((total, expense) => total + expense.value, 0);

    const lucroDoDia = totalGanhoDoDia - totalGastoDoDia;
    const lucroSemanal = totalGanhoSemanal - totalGastoSemanal;
    const lucroMensal = totalGanhoMensal - totalGastoMensal;

    const resultado = {
        gastoDoDia: totalGastoDoDia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        ganhoDoDia: totalGanhoDoDia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lucroDoDia: lucroDoDia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        gastoSemanal: totalGastoSemanal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        ganhoSemanal: totalGanhoSemanal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lucroSemanal: lucroSemanal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        gastoMensal: totalGastoMensal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        ganhoMensal: totalGanhoMensal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lucroMensal : lucroMensal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
    console.log(resultado);
    return resultado;
    
   } 
}




