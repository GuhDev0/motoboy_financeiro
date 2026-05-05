import { NextRequest, NextResponse } from "next/server";
import { ENDPOINTS } from "@/src/config/endpoints";
import { cookies } from "next/headers";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const response = await fetch(ENDPOINTS.EXPENSE_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao registrar despesa" },
        { status: response.status }
      );
    }

    return NextResponse.json({ mensagem: "Despesa registrada com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";

    const response = await fetch(ENDPOINTS.EXPENSE_LIST, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.mensagem || "Erro ao buscar despesas" },
        { status: response.status }
      );
    }

    let expenses = data.expenses ?? data.Expenses ?? [];

    if (search) {
      expenses = expenses.filter((expense: any) => {
        const normalized = [
          expense.description,
          expense.category,
          expense.date,
          expense.value,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return normalized.includes(search);
      });
    }

    return NextResponse.json({ expenses });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
