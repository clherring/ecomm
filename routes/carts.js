const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

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
    req.session.cartId = cart.id;
  } else {
    //we have a cart, lets get it from the carts repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  //either increment quantity for existing product or add new product to items array
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    //increment quantity and save to cart
    existingItem.quantity++;
  } else {
    //add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect("/cart");
});
//receive a get request to show all items in cart
router.get("/cart", async (req, res) => {
  //make sure user has cart assigned to them, if no cart, then
  // we redirect to product listing page
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  /*once we get our cart, we need to iterate over list of items to grab and display
  product information by id in products repo
  */
  for (let item of cart.items) {
    //item === { id: , quantity: }
    // grab product by id from products repo
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

/*receive a post request to delete an item from a cart
  we want to remove that id from array 
and then return cart with leftover items back to carts repo
*/
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  //reach into carts repo and find cart with given id, save it to cart variable
  const cart = await cartsRepo.getOne(req.session.cartId);
  /*then iterate through list of items, when we find id that matches. 
  "itemId" is coming out of req.body, item.id is coming from item we are 
  iterating over

  */
  const items = cart.items.filter((item) => item.id !== itemId);

  await cartsRepo.update(req.session.cartId, { items });
  //redirect user back to cart
  res.redirect("/cart");
});

module.exports = router;
