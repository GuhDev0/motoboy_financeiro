import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";


type LoginResponse = {
  token: string;
};

export async function POST(request: Request) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro no login" },
        { status: response.status }
      );
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "Token não retornado" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({
      mensagem: "Login realizado com sucesso",
      
    });

    res.cookies.set("authToken", data.token, {
      httpOnly: true,
     secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}