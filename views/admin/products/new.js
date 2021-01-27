const layout = require("../layout");
const { getError } = require("../../helpers");
//use getError to reach into errors object so as to print errors on form
module.exports = ({ errors }) => {
  return layout({
    /*put in different enctype, default is urlencoded which doesn't work for 
    larger, more complex attachements, they can't but put in url. 
    Multipart enables that. */
    content: `
    <form method="POST" enctype="multipart/form-data">
      <input placeholder="Title" name="title" />
      ${getError(errors, "title")}
      <input placeholder="Price" name="price" />
      ${getError(errors, "price")}
      <input type="file" name="image" />
      <button>Submit</button>
    </form>
    `,
  });
};
