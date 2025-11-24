const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Configurações da Z-API
const INSTANCE_ID = process.env.INSTANCE_ID; // ID da instância
const ZAPI_TOKEN = process.env.ZAPI_TOKEN; // Token da instância
const CLIENT_TOKEN = process.env.CLIENT_TOKEN; // Client-token

// Base URL da API
const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE_ID}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN,
  },
});

// Rota para enviar mensagem
app.post("/send-message", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Número e mensagem são obrigatórios!" });
  }

  try {
    const response = await API.post("/send-text", { phone, message });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao enviar mensagem", details: error.response?.data || error.message });
  }
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API Z-API está funcionando! 🚀");
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
