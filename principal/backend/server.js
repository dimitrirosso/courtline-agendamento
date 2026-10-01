import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  ssl: {
    rejectUnauthorized: true,
  },
});

app.post("/cadastrar", async (req, res) => {
  const { nome, esporte, horario_entrada, horario_saida } = req.body;
  try {
    const [resultado] = await db.query(
      "INSERT INTO agendamento(nome, esporte, horario__entrada, horario__saida) VALUES(?, ?, ?, ?)",
      [nome, esporte, horario_entrada, horario_saida],
    );

    res.status(201).json({ mensagem: "cadastrado!", id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ mensagem: erro });
  }
});

app.delete("/deletar/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [resultado] = await db.query("DELETE FROM agendamento WHERE id = ?", [
      id,
    ]);

    res.status(200).send({ Mensagem: "Deletado!" });
  } catch (erro) {
    res.status(500).send({ Erro: erro });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando...."));
