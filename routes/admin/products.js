const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuth } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuth, async (req, res) => {
  //make it so we double check someone is logged in in order to be able to access thi page

  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});
// 'get' retrieves form
router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});
// post handles information submitted by user
router.post(
  "/admin/products/new",
  requireAuth,
  //first get parsed and get access to image and req.body and through that, our title and price
  upload.single("image"),
  [requireTitle, requirePrice],
  /* no parenthesis with productsNewTemplate bc we are passing a reference 
  to this function so that it can be called at some point in the future repeatedly
  every time a request comes in
  */
  handleErrors(productsNewTemplate),
  async (req, res) => {
    //'base64' can safely represent an image in string format
    const image = req.file.buffer.toString("base64");
    /*want to access title and price from req.body.
    Now we have an image, the title and the price and we can use crete method
    */
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    /* after creating a product, redirect user to different url, take user to products
    page after creating one
    */
    res.redirect("/admin/products");
  }
);
router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);

  //check to make sure there is a product with given id
  if (!product) {
    return res.send("Product not found");
  }
  res.send(productsEditTemplate({ product }));
});

router.post("/admin/products/:id/edit", requireAuth, async (req, res) => {
  //form submission here, possible file upload
});

module.exports = router;
