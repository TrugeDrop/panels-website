const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Panel = require("../models/panel");
const CusSess = require('../models/customer-session');

router.get("/", (req,res) => {
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    Panel.find({ active: true }, function(err,panels){
        CusSess.find({customerid: user._id}, function(err,cs){
            res.render("manage/main", {title: "Aboneliği Yönet", user: user, panels: panels, cs: cs });
        });
    }).sort({ createdAt: -1 });
  });
});

router.get("/download/:id", (req,res) => {
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    Panel.findById(req.params.id, function(err,panel){
      res.download("../media/panels/"+panel.version+".exe")
    });
  });
});

router.get('/delete-session/:id', (req,res) => {
    if(!req.session.userId) return res.redirect('/account/login');
    CusSess.findByIdAndDelete(req.params.id, function(err){
        if(err) return res.send('Bir hata oluştu!');
        res.redirect('/manage');
    });
});

module.exports = router;
