import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";

export async function POST(request: NextRequest) {
    
    try {
        const body = await request.json();
        const { nameComplete, email, password } = body;

        const response = await fetch(ENDPOINTS.REGISTER_USER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nameComplete,
                email,
                password
            }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.mensagem || "Erro ao registrar usuario" },
                { status: response.status }
            );
        }

        return NextResponse.json({ mensagem: "usuario registrado com sucesso" });
    } catch (error: any) {
        return NextResponse.json({ erro: error.message });
    }
}
