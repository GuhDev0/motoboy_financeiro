import dotenv from "dotenv";
import express from "express";
import router from "./Router/router.js";
import cors from "cors";

const app = express();

/* ===============================
   Configurações
=============================== */
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/financeiroMotoboy", router);
const PORT = process.env.PORT;

/* ===============================
   Rotas
=============================== */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Servidor rodando com sucesso ",
  });
});


/* ===============================
   Inicialização do servidor
=============================== */
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});