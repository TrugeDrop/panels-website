const express = require("express");
const router = express.Router();
const PlS = require("../models/plugin-suggestion");
const User = require("../models/user");
const CusSess = require('../models/customer-session');

router.post("/plugin-suggestion", async function(req,res){
    if(!req.body.pluginurl) return res.json({status: "error", msg: "Plugin URL not specified"});
    const new_PlS = new PlS({
      pluginurl: req.body.pluginurl
    });
    new_PlS.save(function(err){
      res.send("Eklenti önerdiğiniz için teşekkür! Bu sayfayı kapatabilirsiniz.");
    });
    //res.json({"status": "success", "msg": "Plugin recommendation successfully registered"});
});

router.post("/manage/add-session", function(req,res){
    if(!req.session.userId) return res.redirect('/account/login');
    User.findById(req.session.userId, function(err,user){
       if(user.subscription == "none") return res.send('Bunun için abone olmalısınız!');
        const new_sess = new CusSess({
           customerid: user._id,
           ip: req.body.ip,
           del_time: req.body.del_time
        });
        
        new_sess.save(function(err){
           if(err) return res.send('Bir hata oluştu!');
            res.redirect('/manage');
        });
    });
});

module.exports = router;