"use client";
import { api } from "@/src/services/api";
import { authService } from "@/src/services/autheService";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginAuth = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
        try {
            
            const data = await authService.login(email, password);
            router.push("/main");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form action="" onSubmit={loginAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}