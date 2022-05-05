const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Panel = require("../models/panel");

router.get("/", (req,res) => {
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    Panel.find({ active: true }, function(err,panels){
      res.render("manage/main", {title: "Aboneliği Yönet", user: user, panels: panels });
    }).sort({ createdAt: -1 });
  });
});

router.get("/download/:id", (req,res) => {
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    Panel.findById(req.params.id, function(err,panel){
      res.download("./panels/"+panel.version+".zip")
    });
  });
});

module.exports = router;
