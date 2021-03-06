require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressSession = require('express-session');
const logger = require('express-iplogger');
const bodyParser = require('body-parser');
const layout = require("express-ejs-layouts");
const flash = require('connect-flash');
const connectMongo = require('connect-mongo');
const expressFileUpload = require("express-fileupload");

app.use(expressFileUpload());
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("layout", "./inc/layout");
app.use('/media', express.static("../media"));
app.use(express.static("./public"));
app.use(layout);
app.use(flash());

//Logger
app.set('trust proxy', true);
const options = {
	cacheAge: 120 // 120 seconds
}
app.use(logger(options));

app.use(expressSession({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  store: connectMongo.create({ mongoUrl: process.env.dburl })
}))

mongoose.connect(process.env.dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => {
  app.listen(process.env.port, () => console.log('Site hazır !'));
})
.catch(() => {
  console.log('Site hazır değil !')
});

app.use((req,res,next) => {
  console.log(req.method+" "+req.path);
  next();
});

app.use(require('./routers/main'));
app.use('/account', require('./routers/account'));
app.use('/manage', require('./routers/manage'));
app.use('/admin', require('./routers/admin'));
app.use("/posts", require("./routers/posts"));

//404 sayfası
app.use(function (req, res, next) {
  res.status(404).send("Sayfa Bulunamadı !")
});
