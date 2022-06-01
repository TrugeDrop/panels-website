const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Plugin = require("../models/plugin");
const CusSess = require('../models/customer-session');

router.get("/", (req,res) => {
  res.render("index", {title: "Ana Sayfa", user: null});
});

router.get("/info", (req,res) => {
  res.render("site/info", {title: "Bilgi", user: null});
});

//Plugin API
router.get("/plugin-get/user/:user/plugins", (req,res) => {
  User.findById(req.params.user, function(err,user){
    if(!user) return res.send("Kullanıcı bulunamadı!");
    // session control
    CusSess.find({customerid: user._id}, function(err,cs){
    var sess = cs.some(sessFunc);
    function sessFunc(deger, indeks, dizi){
        return deger.ip == req.ipinfo.ip;
    };
    if(sess != true) return res.send('IP Adresinize ait oturum bulunamadı! Lütfen yönetim panelinden ekleyiniz.');
      
    Plugin.find({active: true}, function(err,pls){
      var result = pls.map(resultFunc);
      
      function resultFunc(v, i, a){
        return {
          name: v.name,
          page: v.page,
          description: v.description,
          versions: v.versions
        }
      };
      
      res.json(result);
    });
  });
  });
});

router.get("/plugin-get/user/:user/plugin/:plugin", (req,res) => {
  User.findById(req.params.user, function(err,user){
    if(!user) return res.send("Kullanıcı bulunamadı!");
    // session control
    CusSess.find({customerid: user._id}, function(err,cs){
    var sess = cs.some(sessFunc);
    function sessFunc(deger, indeks, dizi){
        return deger.ip == req.ipinfo.ip;
    };
    if(sess != true) return res.send('IP Adresinize ait oturum bulunamadı! Lütfen yönetim panelinden ekleyiniz.');
    
    Plugin.findOne({name: req.params.plugin, active: true}, function(err,pl){
      if(!pl) return res.send("Eklenti bulunamadı!");
      
      res.json({name: pl.name, page: pl.page, description: pl.description, versions: pl.versions});
    });
    });
  });
});

router.get("/plugin-get/user/:user/plugin/:plugin/version/:version", (req,res) => {
  User.findById(req.params.user, function(err,user){
    if(!user) return res.send("Kullanıcı bulunamadı!");
    // session control
    CusSess.find({customerid: user._id}, function(err,cs){
    var sess = cs.some(sessFunc);
    function sessFunc(deger, indeks, dizi){
        return deger.ip == req.ipinfo.ip;
    };
    if(sess != true) return res.send('IP Adresinize ait oturum bulunamadı! Lütfen yönetim panelinden ekleyiniz.');
    
    Plugin.findOne({name: req.params.plugin, active: true}, function(err,pl){
      if(!pl) return res.send("Eklenti bulunamadı!");
      
      let version = pl.versions[pl.versions.findIndex(i => i.version == req.params.version)].version;
      let url = pl.versions[pl.versions.findIndex(i => i.version == req.params.version)].url;
      
      res.json({name: pl.name, version: version, url: url});
    });
    });
  });
});

module.exports = router;
