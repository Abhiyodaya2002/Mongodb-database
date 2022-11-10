//jshint esversion:6
const express =require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
//const encrypt=require("mongoose-encryption");
const md5=require("md5");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

const app=express();
app.use (express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(session({
    secret: 'this is my secret',
    resave: false,
    saveUninitialized: true,
    
  }));

  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

//----> it was level 2 method of security and hence weaker
//var secret = "thisismysecretstring";
//userSchema.plugin(encrypt, { secret: secret , encryptedFields : ['password']});
const User=new mongoose.model("User",userSchema); 

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

/*

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password:md5(req.body.password)

    })
    newUser.save(function(err)
    {
        if(err)
        res.send(err);
        else 
        res.render("secrets");
    })

});

app.post("/login",(req,res)=>{
    let username=req.body.username;
    let pass=md5(req.body.password);
    User.findOne({email: username},(err,result)=>{
        if(err)
        console.log(err);
        else if(result)
        {
           if(result.password===pass)
           res.render("secrets");
           else
           res.send("not a valid user");
        }
    })
})

*/

//It is for using level 5 security : cookies and sessions
app.get("/secrets",(req,res)=>{
    //we will find all those users who have their secrets field in data base not equal to null. how to do so ...use google
    User.find({"secret":{$ne: null}},function (err,results){
if(err)
{
    res.send(err);
}
else{
   
    res.render("secrets",{userswithsecrets:results});
}
    })
});
app.get('/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  app.get("/submit",(req,res)=>{
    if(req.isAuthenticated())
    {
        res.render("submit");
    }else{
        res.redirect("/login");
    }
  });
  app.post("/submit",(req,res)=>{
    const submittedSecret=req.body.secret;
    //passport saves the users details very handly in req variable 
    console.log(req.user.id);
    User.findById(req.user.id,(err,foundUser)=>{
        // we will find that user in database with his id and then we will store his secret into the secret variable of user schema  
    if(err)
    console.log(err);
    else
    {
        foundUser.secret=submittedSecret;
        foundUser.save();
        res.redirect("/secrets");
    }

    })

  })
app.post("/register",(req,res)=>{
    User.register({username:req.body.username},req.body.password,function(err,User){
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else
        {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    })
});

app.post("/login",(req,res)=>{
   const user=new User({
    username: req.body.username,
    password: req.body.password
   })
   req.login(user,(err)=>{
    if(err)
    console.log(err);
    else
    {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
})
});


app.listen(3000,()=>{
    console.log("server running at port 3000");
})
;