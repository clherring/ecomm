const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const app = express();

/* First middleware, coming directly from express. 
Look in current directory for 'public' folder and make
everything available to outside world
*/
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["lkasld235j"],
  })
);
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log("Listening");
});
