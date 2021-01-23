const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});
// 'get' retrieves form
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});
// post handles information submitted by user
router.post(
  "/admin/products/new",
  [requireTitle, requirePrice],
  upload.single("image"),
  (req, res) => {
    const errors = validationResult(req);

    console.log(req.file);

    res.send("submitted");
  }
);

module.exports = router;
