"use client";
import { useState } from "react";

type Expense = {
    description: string;
    value: number;
    date: string;
    category: "GASOLINA" | "MANUTENCAO" | "ALIMENTACAO" | "OUTROS";
    userId: number;
};

export default function Expense() {
    
    const [expenses, setExpenses] = useState<Expense[]>([]);

    
    const [form, setForm] = useState<Expense>({
        description: "",
        value: 0,
        date: "",
        category: "OUTROS",
        userId: 0,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "value" ? Number(value) : value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setExpenses((prev) => [...prev, form]);


        setForm({
            description: "",
            value: 0,
            date: "",
            category: "OUTROS",
            userId: 0,
        });
    }
    function handleRemove(index: number) {
        setExpenses((prev) => prev.filter((_, i) => i !== index));
    
    }
    return (
        <div className="expense_container">
            <header>
                <h1>Despesas</h1>

                <form onSubmit={handleSubmit}>
                   

                    <input
                        type="number"
                        name="value"
                        placeholder="Valor"
                        value={form.value}
                        onChange={handleChange}
                        
                    />

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />

                    <select name="category" id="" value={form.category} onChange={handleChange}>
                        <option value="GASOLINA">GASOLINA</option>
                        <option value="MANUTENCAO">MANUTENCAO</option>
                        <option value="ALIMENTACAO">ALIMENTACAO</option>
                        <option value="OUTROS">OUTROS</option>
                    </select>
                     <input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <button type="submit">Adicionar</button>
                </form>
            </header>

            <main>
                <table>
                    <thead>
                        <tr>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Categoria</th>
                             <th>Descrição</th>
                        </tr>
                    </thead>

                    <tbody>
                        { expenses.length > 0 ? (
                            expenses.map((expense, index) => (
                                <tr key={index}>

                                    <td>R$ {expense.value}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.description}</td>
                                    <button onClick={() => handleRemove(index)}>Remover</button>
                                </tr>
                            ) )
                        ) : (
                            <tr>
                                <td colSpan={4}>Nenhuma despesa registrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}