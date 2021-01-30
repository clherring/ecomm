const { validationResult } = require("express-validator");

/*middlewares must be functions, they get called with req, res and then next,
it says to express, we're done with all computation inside here, now you can 
continue processing this request; express was originally written before 
promises and async/await, so "callback" style function is used here as 
primary controlled mechanisms in express
*/
module.exports = {
  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }
        /* take whatever keys and values in the data object, merge into extisting 
        object we have, take tate and merge it into existing one

        */
        return res.send(templateFunc({ errors, ...data }));
      }
      //if there are no errors, then go on with request
      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    next();
  },
};
