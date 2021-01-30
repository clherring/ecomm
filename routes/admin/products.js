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

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  //form submission here, possible file upload
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;
    /*take updated title, image, other info that may have been changed
    and apply all those changes into products repo for particular product.
    So if there is a req.file (file uploaded by user), we can convert to string and then
    apply to product repo
    */
    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }
    /*update method comes from repository class we created, two params, the id and 
    the attributes we're updating
    */
    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Could not find item");
    }
    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id);

  res.redirect("/admin/products");
});

module.exports = router;
