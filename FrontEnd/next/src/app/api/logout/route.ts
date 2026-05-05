import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    mensagem: "Logout realizado com sucesso",
  });

  // 🔥 remove o cookie
  response.cookies.set("authToken", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  return response;
}