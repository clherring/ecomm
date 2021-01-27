const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
//as per multer documentation
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});
// 'get' retrieves form
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});
// post handles information submitted by user
router.post(
  "/admin/products/new",
  //first get parsed and get access to image and req.body and through that, our title and price
  upload.single("image"),
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }));
    }
    //'base64' can safely represent an image in string format
    const image = req.file.buffer.toString("base64");
    /*want to access title and price from req.body.
    Now we have an image, the title and the price and we can use crete method
    */
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send("submitted");
  }
);

module.exports = router;
