const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/account");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AccountSchema = new Schema(
  {
    username: String,
    password: String,
    role: Number,
  },
  { collection: "account" }
);
const AccountModel = mongoose.model("account", AccountSchema);
module.exports = AccountModel;
