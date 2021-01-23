const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ errors }) => {
  return layout({
    /*put in different enctype, default is urlencoded which doesn't work for 
    larger, more complex attachements, they can't but put in url. 
    Multipart enables that. */
    content: `
    <form method="POST" enctype="multipart/form-data">
      <input placeholder="Title" name="title" />
      <input placeholder="Price" name="price" />
      <input type="file" name="image" />
      <button>Submit</button>
    </form>
    `,
  });
};
