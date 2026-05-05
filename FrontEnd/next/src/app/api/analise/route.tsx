import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";
import { cookies } from "next/headers";

const getToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("authToken")?.value;
};

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const response = await fetch(ENDPOINTS.ANALISE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao buscar análise" },
        { status: response.status }
      );
    }

    
    return NextResponse.json(data);
   

    
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
