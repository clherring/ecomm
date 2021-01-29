const layout = require("../layout");

/* this will be called with an object, that has some product inside of it
what we want to edit. we want to take some information out of this object and show it inside
a form as default values for some inputs

*/
module.exports = ({ product }) => {
  return layout({
    content: `
      <form method="POST">
        <input name="title" value="${product.title}" />
        <input name="price" value="${product.price}" />
        <input name="image" type="file" />
        <button>Submit</button>
      </form>
    `,
  });
};
