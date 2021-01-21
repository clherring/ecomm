const express = require("express");
//we only care about check function from the validator
const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");
//create a subrouter, like "app", export it, require it into index.js and link it up to express "app"
// this router will keep track of all the route handlers in this file, operates like "app"
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

/*how to handle post request. data put in get stored in request body
 */
router.post(
  "/signup",
  /*with express validator, we can chain calls together for multiple validators/sanitizers
   */
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;

    //create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    //store the id of that user inside the users cookie
    req.session.userId = user.id;
    /*req.session is additional property added by cookie session. 
  Any info we store in this object will be maintained by this middleware, 
  take info, encode into a string and attach it to outgoing response as cookie
  that should be stored on user's browser */

    res.send("Account created!!!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const { email } = req.body;

    //check to see if existing user with given email
    const user = await usersRepo.getOneBy({ email });

    //this is what makes our user "authenticated" with our app
    req.session.userId = user.id;
    res.send("You are signed in!");
  }
);

module.exports = router;
