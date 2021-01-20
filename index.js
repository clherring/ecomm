const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");

const app = express();

//every route handler will automatically be body parsed for us
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["lkakeniovlpne"],
  })
);
app.use(authRouter);
/*add route handler, how to handle request from browser.
req stands for request to our server from the browswer, 
res stands for response from our server back to browser */

//watch for incoming requests that have 'get'

app.listen(3000, () => {
  console.log("Listening");
});
