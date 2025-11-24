const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// LOGS
console.log("INSTANCE_ID:", process.env.INSTANCE_ID);
console.log("ZAPI_TOKEN:", process.env.ZAPI_TOKEN);
console.log("CLIENT_TOKEN:", process.env.CLIENT_TOKEN);

// CONFIG
const INSTANCE_ID = process.env.INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

const API = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE_ID}/token/${ZAPI_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "client-token": CLIENT_TOKEN,
  },
});

// TESTE API
app.get("/", (req, res) => {
  res.send("API rodando no Railway! 🚀");
});

// WEBHOOK
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", req.body);

  const mensagem = req.body?.data?.message;
  const telefone = req.body?.data?.phone;

  if (!mensagem || !telefone) {
    return res.sendStatus(200);
  }

  try {
    await API.post("/send-text", {
      phone: telefone,
      message: `Recebi: ${mensagem}`,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log("Erro ao responder:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

// RODA O SERVIDOR NA PORTA 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
