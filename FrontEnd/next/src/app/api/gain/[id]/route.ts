import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";
import { cookies } from "next/headers";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${ENDPOINTS.GAIN_DETAIL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao buscar ganho" },
        { status: response.status }
      );
    }

    return NextResponse.json({ gain: data.gain ?? data });
  } catch (error: any) {
    return NextResponse.json(
      { erro: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = await getToken();
    const body = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const response = await fetch(`${ENDPOINTS.GAIN_UPDATE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao atualizar ganho" },
        { status: response.status }
      );
    }

    return NextResponse.json({ mensagem: "Ganho atualizado com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const response = await fetch(`${ENDPOINTS.GAIN_DELETE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao excluir ganho" },
        { status: response.status }
      );
    }

    return NextResponse.json({ mensagem: "Ganho excluído com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}