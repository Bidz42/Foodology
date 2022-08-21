const router = require("express").Router();
const { isLoggedIn, isOwner } = require('../middleware/checker');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
