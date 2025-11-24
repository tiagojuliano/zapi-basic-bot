
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const INSTANCE = "3EA9E26D9B54A1959179B2694663CF7D";
const TOKEN = "27007D267B55D0B069029678";

const api = axios.create({
  baseURL: `https://api.z-api.io/instances/${INSTANCE}/token/${TOKEN}`,
  headers: {"Content-Type": "application/json"}
});

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  let phone = req.body.phone || req.body?.message?.sender?.replace("@c.us","") || req.body?.messages?.[0]?.from?.replace("@c.us","");
  let text = req.body.text || req.body?.message?.text || req.body?.messages?.[0]?.text;

  if (!phone || !text) {
    console.log("Ignorado");
    return res.sendStatus(200);
  }

  try {
    await api.post("/send-text", {
      phone,
      message: "Recebi sua mensagem!"
    });
    console.log("Respondido");
  } catch(err) {
    console.error("Erro:", err.response?.data || err.message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>console.log("Server rodando na porta", PORT));
