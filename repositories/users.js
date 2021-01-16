//expecting JSON file of data

const fs = require("fs");
// use crypto library to generate unique id for each input
const crypto = require("crypto");

class UsersRepository {
  /*constructor gets called instantly when instance of class created - use this
  to check to see if we have a file on hard drive we can store info
  to. So, in this case we want to expect a file name as an argument - if
  there is no filename (place for data to be stored), we should throw 
  an error */
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;

    /*    /* check to see if file exists, otherwise create it right away.
    Access function can be used for this. Constructor functions themselves are not allowed to be async in nature. 
    AccessSync rarely used, but for this case, it works, will only be called once */
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      /*create file if file doesn't exist, this will create a file 
      that contains an empty array - creating array data structure for this file */
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    //Open the file called this.filename (whatever this.filename is pointing to)
    //parse JSON data  into array of javascript objects
    //return parsed data*/
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }
  //create a user with given attributes (attrs)
  async create(attrs) {
    attrs.id = this.randomId();
    /*every time we want to make a change to our users, we're first going to load up entire
    user.json file - the most recent collection of our data, and then add in new user to file,
    and write it back to our hard drive*/
    const records = await this.getAll();
    records.push(attrs);
    /*write updated 'records' array back to this.filename.
    Turn data back into JSON and then write data back to file */
    await this.writeAll(records);
    return attrs;
  }
  /*Save multiple records. 2nd argument to JSON.stringify to customize how thing
  is evaluated. null bc we don't want any custom formatters, but the 3rd argument - 
  if we put a number there, that designates the level of indentation to use inside of string.
  So with every deeper nesting, we're getting 2 spaces inserted */
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
  /*Create a random ID for every input using node.js standard library, 4 random bytes. 
  Want to string them together to create one line ID*/
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
  //grab record with id provided
  async getOne(id) {
    //grab all the records
    const records = await this.getAll();
    //use find() array helper method to find the one that matches id provided
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  //update by id, provide id whose attrs you want to change, add attrs
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    //update record with new attrs
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  /* get user that matches attributes/filters provided, very flexible method that will
find any arbitrary record with any arbitrary attributes/filters */
  async getOneBy(filters) {
    const records = await this.getAll();
    //iterate through ARRAY of records
    for (let record of records) {
      let found = true;
      //iterate through key value pairs of each record OBJECT
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}
//export new instance of class. We can start calling methods immediately
module.exports = new UsersRepository("users.json");
