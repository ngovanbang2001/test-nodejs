const express = require("express");
const router = express.Router();
const PAGE_SIZE = 2;
const AccountModel = require("../models/account");
router.get("/", (req, res) => {
  let page = req.query.page;
  if (page) {
    if (page < 1) page = 1;
    var slskip = (page - 1) * PAGE_SIZE;
  }
  AccountModel.find({})
    .skip(slskip)
    .limit(PAGE_SIZE)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});
//get 1 muc
router.get("/:id", (req, res) => {
  const id = req.params.id;

  AccountModel.findOne(id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});
router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  AccountModel.create({ username: username, password: password })
    .then((data) => res.json("them account thanh cong "))
    .catch((err) => res.status(500).json(err));
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newPassword = req.body.newPassword;
  AccountModel.findByIdAndUpdate(id, { password: newPassword })
    .then((data) => res.json("Sua thanh cong "))
    .catch((err) => res.status(500).json(err));
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  AccountModel.deleteOne({ _id: id })
    .then((data) => res.json("xoa thanh cong"))
    .catch((err) => res.status(500).json(err));
});
module.exports = router;
