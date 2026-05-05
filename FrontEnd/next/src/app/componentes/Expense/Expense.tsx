"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import "./expense.css";

type Expense = {
  id: number;
  description: string;
  value: number;
  date: string;
  category: "GASOLINA" | "MANUTENCAO" | "ALIMENTACAO" | "OUTROS";
  userId: number;
};

export default function Expense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<Partial<Expense>>({
    description: "", value: 0, date: "", category: "OUTROS", userId: 0,
  });
  const [search, setSearch]       = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage]     = useState("");

  useEffect(() => { fetchExpenses(); }, []);

  async function fetchExpenses(searchTerm = "") {
    try {
      const response = await api.get("/expense", {
        params: searchTerm ? { search: searchTerm } : undefined,
      });
      setExpenses(response.data.expenses ?? []);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "value" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expense/${editingId}`, form);
        setMessage("Despesa atualizada com sucesso.");
      } else {
        await api.post("/expense", form);
        setMessage("Despesa registrada com sucesso.");
      }
      setForm({ description: "", value: 0, date: "", category: "OUTROS", userId: 0 });
      setEditingId(null);
      await fetchExpenses(search);
    } catch {
      setMessage("Erro ao salvar despesa.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/expense/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setMessage("Despesa excluída com sucesso.");
    } catch {
      setMessage("Erro ao excluir despesa.");
    }
  }

  function handleEdit(expense: Expense) {
    setEditingId(expense.id);
    setForm({ ...expense });
    setMessage("Modo edição ativado.");
  }

  return (
    <div className="expense_container">
      <header>
        <h1>Despesas</h1>
        <p className="expense_page-subtitle">Registre e gerencie todas as suas saídas financeiras</p>

        {/* Busca */}
        <div className="expense_actions">
          <input
            type="text"
            placeholder="🔍  Buscar despesas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchExpenses(search)}
          />
          <button className="btn-search" type="button" onClick={() => fetchExpenses(search)}>
            Buscar
          </button>
          <button className="btn-clear" type="button" onClick={() => { setSearch(""); fetchExpenses(); }}>
            Limpar
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="value"
            placeholder="Valor (R$)"
            value={form.value ?? 0}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={form.date ?? ""}
            onChange={handleChange}
          />
          <select name="category" value={form.category ?? "OUTROS"} onChange={handleChange}>
            <option value="GASOLINA">⛽ Gasolina</option>
            <option value="MANUTENCAO">🔧 Manutenção</option>
            <option value="ALIMENTACAO">🍔 Alimentação</option>
            <option value="OUTROS">📦 Outros</option>
          </select>
          <input
            type="text"
            name="description"
            placeholder="Descrição"
            value={form.description ?? ""}
            onChange={handleChange}
          />
          <button type="submit">{editingId ? "✓ Atualizar" : "+ Adicionar"}</button>
        </form>

        {message && <p className="expense_message">{message}</p>}
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Valor</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>R$ {expense.value.toFixed(2)}</td>
                  <td>{new Date(expense.date).toLocaleDateString("pt-BR")}</td>
                  <td><span className="badge-category">{expense.category}</span></td>
                  <td>{expense.description}</td>
                  <td>
                    <button className="btn-edit"   type="button" onClick={() => handleEdit(expense)}>Editar</button>
                    <button className="btn-delete" type="button" onClick={() => handleDelete(expense.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="table-empty" colSpan={5}>Nenhuma despesa registrada.</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
