const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/login", (req,res) => {
  if(req.session.userId) return res.redirect("/manage");
  res.render("account/login", {title: "Giriş Yap", user: null, page: []});
});

router.get("/register", (req,res) => {
  res.render("account/register", {title: "Kayıt Ol", user: null, page: []});
});

router.post("/login", function(req,res){
  let { username, password } = req.body;
  User.findOne({ username }, function(err,user){
    if(user){
      if(password == user.password){
        if(user.active){
          req.session.userId = user._id;
          req.session.username = user.username;
          res.redirect("/manage");
        }else{
          res.send("Hesabınız askıya alınmıştır!")
        }
      }else{
        res.send("Kullanıcı adı veya parola yanlış!");
      }
    }else{
      res.send("Kullanıcı adı veya parola yanlış!");
    }
  });
});

router.post("/register", function(req,res){
  const user = new User(req.body);
  
  user.save(function(err){
    if(err) return res.send("Bir hata oluştu!");
    res.redirect("/account/login");
  });
});


router.get('/logout', (req,res)=>{
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
