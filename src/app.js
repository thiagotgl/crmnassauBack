import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CRM Nassau rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});