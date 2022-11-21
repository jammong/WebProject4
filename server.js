/*
Name : yeonsu park
Id   :128899218
Email:ypark91@myseneca.ca
*/
var express = require("express");
var app = express();
var path = require("path");
const exphbs = require("express-handlebars");
var HTTP_PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Database password
// YP4jf6pnRSy3AXEU 
const registration = mongoose.createConnection("mongodb+srv://yeonsu:YP4jf6pnRSy3AXEU@web322.o84lom6.mongodb.net/registration?retryWrites=true&w=majority")
const login = mongoose.createConnection("mongodb+srv://yeonsu:YP4jf6pnRSy3AXEU@web322.o84lom6.mongodb.net/registration?retryWrites=true&w=majority")
const blog = mongoose.createConnection("mongodb+srv://yeonsu:YP4jf6pnRSy3AXEU@web322.o84lom6.mongodb.net/?retryWrites=true&w=majority")
const article = mongoose.createConnection("mongodb+srv://yeonsu:YP4jf6pnRSy3AXEU@web322.o84lom6.mongodb.net/?retryWrites=true&w=majority")

const loginSchema = new mongoose.Schema({
  "email" : String,
  "password":String
})
const registrationSchema = new mongoose.Schema({
    "firstname" : String,
    "lastname":String,
     "email":({
        "type":String,
        "unique":true
     }),
     "password":String,
     "reentPassword": String,
     "phoneNumber":String
})

const blogSchema = new mongoose.Schema({
  "blog_title": String,
  "blog_content": String
});

const articleSchema = new mongoose.Schema({
  "article_title": String
});

const userdata = registration.model("registration",registrationSchema);
const linfo = login.model("login",loginSchema);
const blog_c = blog.model("blog",blogSchema)
const article_c = article.model("article",articleSchema)


app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname,"/connection/blog.html"));
})
app.get("/article", function(req,res){
  res.sendFile(path.join(__dirname,"/connection/read_more.html"));
})
  app.get("/registration", function(req,res){
    res.sendFile(path.join(__dirname,"/connection/registration.html"));
  })
app.post("/registration", (req, res) => {
  var regData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      pw: req.body.pw,
      reEntPassword: req.body.reEntPassword,
      phoneNum: req.body.phoneNum,
      expressionP: /^[a-zA-Z]\w{5,15}$/.test(req.body.pw),
      expressionPN: /^[2-9]\d{2}-\d{3}-\d{4}$/.test(req.body.phoneNum)
  }
  matchedPassword = () =>{
    if(regData.password == regData.reEntPw){
      return true;
    }else{
      return false;
    }
  }
   regData.matchedPassword = matchedPassword
  if (regData.firstName == "" || regData.lastName == "" || regData.email == "" || regData.pw == "" || regData.reEntPassword == "" || regData.phoneNum == ""){
    res.render("registration", { data: regData, layout: false });
    return;
  }
  else if (regData.expressionP) {
      res.render("registration", { data: regData, layout: false });
      return;
  } 
  else if (regData.expressionPN) {
    res.render("registration", { data: regData, layout: false });
    return;
}else{
  res.render("dashboard",{layout: false})
}
var registrationInfo = new userdata({
  firstname: regData.firstName,
  lastname: regData.lastName,
  email: regData.email,
  password: regData.pw,
  reentPassword: regData.reEntPassword,
  phoneNumber: regData.phoneNum
}).save((e, data) =>{
  if(e)
  {
      console.log(e); }
  else
  {
      console.log(data); }
});
});
//=======================================
app.get("/login", function(req,res){
  res.sendFile(path.join(__dirname,"/connection/login.html"));
})
app.post("/login", (req, res) => {
  var loginData = {
      email: req.body.email,
      pw: req.body.password,
      expression: /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(req.body.email)
  }
 if (loginData.email == "" || loginData.pw == "") {
    res.render("login", { data: loginData, layout: false });
    return;
}
else if(loginData.expression) {
    res.render("login", { data: loginData, layout: false });
    return;
}
  linfo.findOne({email: loginData.email, password:loginData.pw}).exec().then((data) => {
    if (data) {
        if (data._id == "6370626046815a0a552cdec9") {
            res.render("dashboard", { email: loginData.email, password: loginData.pw, layout: false });
            return;
        } 
        else{
          res.render("login_dashboard", { email: loginData.email, password:loginData.pw, layout: false });
           return;
       }
     }    
    else {
      res.render("login_dashboard", {layout: false });
      return;
    }})   
});
app.use(function(req,res){
  res.status(404).send("Page not found")
})
app.listen(HTTP_PORT)





