/*
route handlers related to products that are exposed 
to all users of application, not just admin
*/
const express = require("express");
const productsRepo = require("../repositories/products");
const productsIndexTemplate = require("../views/products/index");

const router = express.Router();

//home page, show list of products
router.get("/", async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

module.exports = router;
