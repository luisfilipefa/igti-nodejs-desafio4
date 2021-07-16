const express = require("express");
const app = express();
const HttpError = require("./HttpError");
const { product: Product } = require("./db");

const { check, validationResult } = require("express-validator");

const consultaCliente = require("./consulta-cliente");

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("Bootcamp desenvolvedor back end - Tópicos especiais!");
});

app.post(
  "/consulta-credito",

  check("nome", "Nome deve ser informado").notEmpty(),
  check("CPF", "CPF deve ser informado").notEmpty(),
  check("valor", "O valor deve ser um número").notEmpty().isFloat(),
  check("parcelas", "O número de parcelas deve ser um número inteiro")
    .notEmpty()
    .isInt(),

  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array() });
    }

    try {
      const valores = await consultaCliente.consultar(
        req.body.nome,
        req.body.CPF,
        req.body.valor,
        req.body.parcelas
      );
      res.status(201).json(valores);
    } catch (erro) {
      return res.status(405).json({ erro: erro.message });
    }
  }
);

app.post("/api/products", async (req, res, next) => {
  try {
    const { code, description, price } = req.body;

    if (!(code || description || price)) {
      throw new HttpError("Invalid params", 400);
    }

    const productExists = await Product.findOne({ where: { code } });

    if (productExists) {
      await Product.update(
        { ...productExists, description, price },
        { where: { code } }
      );

      const product = await Product.findOne({ where: { code } });

      return res.json({ product });
    }

    const product = await Product.create({ code, description, price });

    return res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { description, price } = req.body;

    if (!(description || price)) {
      throw new HttpError("Invalid params", 400);
    }

    const product = await Product.findOne({ where: { code } });

    if (!product) {
      throw new HttpError("Product not found", 405);
    }

    await Product.update(
      { ...product, description, price },
      { where: { code } }
    );

    const updatedProduct = await Product.findOne({ where: { code } });

    return res.json({ product: updatedProduct });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    const products = await Product.findAll();

    return res.json({ products });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const product = await Product.findOne({ where: { code } });

    if (!product) {
      throw new HttpError("Product not found", 405);
    }

    await Product.destroy({ where: { code } });

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  } else {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = app;
