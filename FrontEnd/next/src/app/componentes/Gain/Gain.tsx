



"use client";
import { useState } from "react";
import { api } from "@/src/services/api";
import { authService } from "@/src/services/autheService";
type Gain = {
    description: string;
    value: number;
    date: string;
    platform: "UBER" | "99" | "KEPPA" | "IFOOD" | "OUTROS";
    userId: number;
};

export default function Gain() {
    
    const [gains, setGains] = useState<Gain[]>([]);

    // estado do formulário
    const [form, setForm] = useState<Gain>({
        description: "",
        value: 0,
        date: "",
        platform: "OUTROS",
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

        api.post("/gain", form)
            .then((response) => {
                console.log("Ganho registrado com sucesso:", response.data);
            })
            .catch((error) => {
                console.error("Erro ao registrar ganho:", error);
            });


        setGains((prev) => [...prev, form]);


        setForm({
            description: "",
            value: 0,
            date: "",
            platform: "OUTROS",
            userId: 0,
        });
    }
    function handleRemove(index: number) {
        setGains((prev) => prev.filter((_, i) => i !== index));

    }

    return (
        <div className="gain_container">
            <header>
                <h1>Ganhos</h1>

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
                    <select name="platform" id="" value={form.platform} onChange={handleChange}>
                        <option value="UBER">UBER</option>
                        <option value="99">99</option>
                        <option value="KEPPA">KEPPA</option>
                        <option value="IFOOD">IFOOD</option>
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
                            <th>Plataforma</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>

                    <tbody>
                        {gains.length > 0 ? (
                            gains.map((gain, index) => (
                                <tr key={index}>

                                    <td>R$ {gain.value}</td>
                                    <td>{gain.date}</td>
                                    <td>{gain.platform}</td>
                                    <td>{gain.description}</td>
                                    <button onClick={() => handleRemove(index)} >Remover</button>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>Nenhum ganho registrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}