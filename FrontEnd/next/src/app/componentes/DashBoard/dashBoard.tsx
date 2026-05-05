    "use client";
    import { api } from "@/src/services/api";
    import { useEffect } from "react";
    export default function DashBoard() {
        const buscarAnalise = async () => {
            try {
            const res = await api.get("/analise");
                return res.data;
            }catch (error) {
                console.error("Erro ao buscar análise:", error);
            }
        }

        useEffect(() => {
            const fetchData = async () => {
                const analiseData = await buscarAnalise();
                console.log("Dados da análise:", analiseData);
            };
            fetchData();
        }, []);

        return (
            <div>
                <header>
                    <h1>DashBoard</h1>
                    <p>Bem-vindo ao seu painel de controle!</p>
                </header>
                <div className="dashBoard_CONTAINER">
                    <div className="dashBoard_TOPO">
                        📌 topo
                        Ganho do dia
                        Lucro do dia
                    </div>
                    <div className="dashBoard_MEIO">
                        📌 meio
                        Gastos
                        gráfico simples
                    </div>
                    <div className="dashBoard_FOOTER">
                        📌 baixo
                        histórico
                        resumo semanal
                    </div>
                </div>

            </div>
        )
    }