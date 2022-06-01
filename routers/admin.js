const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Plugin = require("../models/plugin");
const Panel = require("../models/panel");
const path = require("path");

function userCont(req, res, callback){
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    if(user.auth.indexOf("plugins") != -1 && user.auth.indexOf("admin") == -1) return res.redirect("/admin/plugins");
    if(user.auth.indexOf('admin') == -1) return res.send("Yetersiz yetki!");
    return callback(user);
  });
};

function userPluginCont(req, res, callback){
  if(!req.session.userId) return res.redirect("/account/login");
  User.findById(req.session.userId, function(err,user){
    if(user.auth.indexOf('admin') == -1 && user.auth.indexOf('plugins') == -1) return res.send("Yetersiz yetki!");
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
      file.name = version+".exe";
      file.mv(path.resolve(__dirname, "../../media/panels/", file.name));
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
  userPluginCont(req, res, function(user){
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
  userPluginCont(req, res, function(user){
    let file = req.files.file;
    const pl = new Plugin({
      name: req.body.name,
      description: req.body.description,
      page: req.body.page,
      versions: {version: req.body.version, url: "media/plugins/"+req.body.name+"-"+req.body.version+".jar" },
      active: Boolean(req.body.active === "true")
    });
    
    pl.save(function(err){
      if(err) return res.send("Bir hata oluştu!");
      
      file.mv(path.resolve(__dirname, "../../media/plugins/", req.body.name+"-"+req.body.version+".jar"));
      res.send("Başarılı!");
    });
  });
});

router.get("/plugins/:id/version/delete/:version", (req,res) => {
  userPluginCont(req, res, function(user){
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
  userPluginCont(req, res, function(user){
      Plugin.findById(req.params.id, function(err,pl){
        if(!pl) return res.send("Eklenti bulunamadı!");
        let file = req.files.file;
        
        pl.versions.push({version: req.body.version, url: "media/plugins/"+pl.name+"-"+req.body.version+".jar"});
        
        pl.save();
        
        file.mv(path.resolve(__dirname, "../../media/plugins/", pl.name+"-"+req.body.version+".jar"));
        
        res.redirect("/admin/plugins?name="+pl.name);
      });
  });
});

router.get("/plugins/:id/version/download/:version", (req,res) => {
  userPluginCont(req, res, function(user){
      Plugin.findById(req.params.id, function(err,pl){
        if(!pl) return res.send("Eklenti bulunamadı!");
        
        let result = pl.versions.findIndex(i => i.version == req.params.version);
      
        res.download("../"+pl.versions[result].url);
      });
  });
});

module.exports = router;
