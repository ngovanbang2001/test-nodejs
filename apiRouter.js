const express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.json("router ");
});
router.get("/product", (req, res) => {
  res.json("router product ");
});
router.get("/contact", (req, res) => {
  res.json("router contact");
});
router.get("/:id", (req, res) => {
  res.json("router " + req.params.id);
});
module.exports = router;
