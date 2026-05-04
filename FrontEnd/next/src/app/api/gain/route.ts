import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;
         console.log("TOKEN:", token);   
        
        const response = await fetch(ENDPOINTS.GAIN_REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!token) {
            return NextResponse.json(

                { error: "Não autenticado" },
                { status: 401 }
            );
        }
       

        if (!response.ok) {
                
            return NextResponse.json(
                { error: data.mensagem || "Erro ao registrar ganho" },
                {
                    status: response.status
                },
                
            );
        }

        return NextResponse.json({
            mensagem: "Ganho registrado com sucesso",
        });

    } catch (error: any) {
        return NextResponse.json(
            { erro: error.message },
            { status: 500 }
        );
    }
    
}