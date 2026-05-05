"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import "./gain.css";

type Gain = {
  id: number;
  description: string;
  value: number;
  date: string;
  platform: "UBER" | "99" | "KEPPA" | "IFOOD" | "OUTROS";
  userId: number;
};

export default function Gain() {
  const [gains, setGains]         = useState<Gain[]>([]);
  const [form, setForm]           = useState<Partial<Gain>>({
    description: "", value: 0, date: "", platform: "OUTROS", userId: 0,
  });
  const [search, setSearch]       = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage]     = useState("");

  useEffect(() => { fetchGains(); }, []);

  async function fetchGains(searchTerm = "") {
    try {
      const response = await api.get("/gain", {
        params: searchTerm ? { search: searchTerm } : undefined,
      });
      setGains(response.data.gains ?? []);
    } catch (error) {
      console.error("Erro ao buscar ganhos:", error);
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
        await api.put(`/gain/${editingId}`, form);
        setMessage("Ganho atualizado com sucesso.");
      } else {
        await api.post("/gain", form);
        setMessage("Ganho registrado com sucesso.");
      }
      setForm({ description: "", value: 0, date: "", platform: "OUTROS", userId: 0 });
      setEditingId(null);
      await fetchGains(search);
    } catch {
      setMessage("Erro ao salvar ganho.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/gain/${id}`);
      setGains((prev) => prev.filter((g) => g.id !== id));
      setMessage("Ganho excluído com sucesso.");
    } catch {
      setMessage("Erro ao excluir ganho.");
    }
  }

  function handleEdit(gain: Gain) {
    setEditingId(gain.id);
    setForm({ ...gain });
    setMessage("Modo edição ativado.");
  }

  return (
    <div className="gain_container">
      <header>
        <h1>Ganhos</h1>
        <p className="gain_page-subtitle">Acompanhe todos os seus recebimentos por plataforma</p>

        {/* Busca */}
        <div className="gain_actions">
          <input
            type="text"
            placeholder="🔍  Buscar ganhos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchGains(search)}
          />
          <button className="btn-search" type="button" onClick={() => fetchGains(search)}>
            Buscar
          </button>
          <button className="btn-clear" type="button" onClick={() => { setSearch(""); fetchGains(); }}>
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
          <select name="platform" value={form.platform ?? "OUTROS"} onChange={handleChange}>
            <option value="UBER">🚗 Uber</option>
            <option value="99">🟡 99</option>
            <option value="KEPPA">🔵 Keppa</option>
            <option value="IFOOD">🛵 iFood</option>
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

        {message && <p className="gain_message">{message}</p>}
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Valor</th>
              <th>Data</th>
              <th>Plataforma</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gains.length > 0 ? (
              gains.map((gain) => (
                <tr key={gain.id}>
                  <td>R$ {gain.value.toFixed(2)}</td>
                  <td>{new Date(gain.date).toLocaleDateString("pt-BR")}</td>
                  <td><span className="badge-platform">{gain.platform}</span></td>
                  <td>{gain.description}</td>
                  <td>
                    <button className="btn-edit"   type="button" onClick={() => handleEdit(gain)}>Editar</button>
                    <button className="btn-delete" type="button" onClick={() => handleDelete(gain.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="table-empty-gain" colSpan={5}>Nenhum ganho registrado.</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
