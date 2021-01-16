const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express();

//every route handler will automatically be body parsed for us
app.use(bodyParser.urlencoded({ extended: true }));

/*add route handler, how to handle request from browser.
req stands for request to our server from the browswer, 
res stands for response from our server back to browser */

//watch for incoming requests that have 'get'
app.get("/", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

/*how to handle post request. data put in get stored in request body
 */
app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  //create a user in our user repo to represent this person
  const user = await usersRepo.create({ email: email, password: password });

  //store the id of that user inside the users cookie

  res.send("Account created!!!");
});

app.listen(3000, () => {
  console.log("Listening");
});
