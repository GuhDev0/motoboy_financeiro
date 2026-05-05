"use client";

import { authService } from "@/src/services/autheService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./styles.css";
import { api } from "@/src/services/api";

type registerDataDto = {
    email: string;
    password: string;
    nameComplete: string;
};

export default function Auth() {
    const router = useRouter();

    const [step, setStep] = useState<"login" | "register">("login");
    const [registerData, setRegisterData] = useState<registerDataDto>({
        nameComplete: "",
        email: "",
        password: "",
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await authService.login(email, password);
            router.push("/main");
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerData.email || !registerData.password || !registerData.nameComplete) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await api.post("/users", registerData);

            if (response.status >= 200 && response.status < 300) {
                alert("Cadastro realizado com sucesso!");
                setStep("login");
            }
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            alert(error?.response?.data?.error || "Erro ao cadastrar usuário");
        }
    };

    return (
        <div className="auth-wrapper">

            {/* LOGIN */}
            {step === "login" && (
                <div className="auth-card">
                    <h1>Login</h1>
                    <p className="auth-subtitle">Entre na sua conta</p>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                required
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input
                                required
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn-primary" type="submit">
                            Entrar
                        </button>

                        <div className="auth-footer">
                            <span>Não tem conta?</span>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setStep("register")}
                            >
                                Criar conta
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* REGISTER */}
            {step === "register" && (
                <div className="auth-card">
                    <h1>Cadastro</h1>
                    <p className="auth-subtitle">Crie sua conta</p>

                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="input-group">
                            <label>Nome completo</label>
                            <input
                                type="text"
                                placeholder="Seu nome completo"
                                value={registerData.nameComplete}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, nameComplete: e.target.value })
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                            required
                                type="email"
                                placeholder="Seu email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input
                            required
                                type="password"
                                placeholder="Crie uma senha"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, password: e.target.value })
                                }
                            />
                        </div>

                        <button className="btn-primary" type="submit">
                            Cadastrar
                        </button>

                        <div className="auth-footer">
                            <span>Já tem conta?</span>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setStep("login")}
                            >
                                Voltar ao login
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}