const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

/*receive a post request to add an item to a cart; 
clicking on 'add to cart' triggers a post request
*/
router.post("/cart/products", async (req, res) => {
  //figure out the cart - do we need to create one or retrieve one out of carts repo
  let cart;
  if (!req.session.cartId) {
    //we don't have a cart, we need to create one and store the cart id
    // on the req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cardId = cart.id;
  } else {
    //we have a cart, lets get it from the carts repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  console.log(cart);
  //either increment quantity for existing product or add new product to items array

  res.send("product added to cart");
});
//receive a get request to show all items in cart

//receive a post request to delete an item from a cart

module.exports = router;
