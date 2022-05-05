const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Plugin = require("../models/plugin");
const Panel = require("../models/panel");
const path = require("path");

function userCont(req, res, callback){
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    if(user.auth.indexOf('admin') == -1) return res.send("Yetersiz yetki!");
    return callback(user);
  });
};

router.get("/", (req,res) => {
  userCont(req, res, function(user){  
    res.render("admin/main", {title: "Admin", user: user});
  });
});

router.get("/panels", (req,res) => {
  userCont(req, res, function(user){
    Panel.find({active: true}, function(err,panels){
          res.render("admin/panels", { title: "Paneller", user: user, panels: panels });
    }).sort({ createdAt: -1 });
  });
});

router.post("/panels/add", function(req, res){
  userCont(req, res, function(user){
    let { version, description, active } = req.body;
    let file = req.files.file;
    
    var panel = new Panel(req.body);
    
    panel.save(function(err){
      if(err) return res.send("Bir hata oluştu!"+err);
      
      file.mv(path.resolve(__dirname, "../panels/", file.name));
      res.send("Başarılı!");
    });
  });
});

router.get("/delete/:id", (req,res) => {
  userCont(req, res, function(user){
    Panel.findByIdAndDelete(req.params.id, function(err){
      if(err) return res.sene("Bir hata oluştu!");
      res.send("Başarılı!");
    });
  });
});

router.get("/plugins", (req,res) => {
  userCont(req, res, function(user){
    if(req.query.name){
      Plugin.findOne({name: req.query.name, active: true}, function(err,pl){
        if(!pl) return res.send("Eklenti bulunamadı!");
        res.render("admin/plugin", {title: `Admin Plugin - ${pl.name}`, user: user, pl: pl, page: []});
      });
    }else{
      Plugin.find({active: true}, function(err,pls){
        res.render("admin/plugins", { title: 'Admin - Plugins', user: user, page: [], pls: pls});
      });
    };
  });
});

router.post("/plugins/add", function(req,res){
  userCont(req, res, function(user){
    const pl = new Plugin({
      name: req.body.name,
      description: req.body.description,
      versions: {version: req.body.version, url: req.body.url},
      active: Boolean(req.body.active === "true")
    });
    
    pl.save(function(err){
      if(err) return res.send("Bir hata oluştu!");
      res.send("Başarılı!");
    });
  });
});

router.get("/plugins/:id/version/delete/:version", (req,res) => {
  userCont(req, res, function(user){
      Plugin.findById(req.params.id, function(err,pl){
        if(!pl) return res.send("Eklenti bulunamadı!");
        
        let result = pl.versions.findIndex(i => i.version == req.params.version);
        
        if(result > -1){
          pl.versions.splice(result, 1)
        }
        
        pl.save();
        
        res.redirect("/admin/plugins?name="+pl.name);
      });
  });
});

router.post("/plugins/:id/version/add", (req,res) => {
  userCont(req, res, function(user){
      Plugin.findById(req.params.id, function(err,pl){
        if(!pl) return res.send("Eklenti bulunamadı!");
        
        pl.versions.push({version: req.body.version, url: req.body.url});
        
        pl.save();
        
        res.redirect("/admin/plugins?name="+pl.name);
      });
  });
});

module.exports = router;
