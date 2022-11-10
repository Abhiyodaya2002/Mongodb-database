const express= require("express");
const bodyparser=require("body-parser");

const ejs= require("ejs");
const mongoose=require("mongoose");
const app=express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema={
    title: String ,
    content: String
}

const Article=new mongoose.model("Article", articleSchema);
//REQUESTS TARGETING ALL ARTICLES........
app.get("/",(req,res)=>{
res.send("Pandey here")
})
app.get("/articles",(req,res)=>{
    Article.find({},(err,results)=>
    {
        if(!err)
        {
            res.send(results);
        }
    });
    });
    app.post("/articles",(req,res)=>{
        const newArticle= new Article({
            title:req.body.title,
            content:req.body.content
        })
        newArticle.save();
        res.send("thanks")
    })
    app.delete("/articles",(req,res)=>{
          Article.deleteMany({},(err)=>{
              if(!err)
              res.send("deleted successfully");
              else
              res.send(err);
          })
    })

    //REQUESTS TARGETING SINGLE ARTICLES........
    app.route("/articles/:articleTitle")
   .get((req,res)=>{
     Article.findOne({title:req.params.articleTitle},(err,result)=>
     {
        if(err)
        res.send("there is an error")
        if(result)
        res.send(result);
        else
        res.send("No matching article is present, sorry!");
     })
   })
   .put((req,res)=>{
    Article.updateMany(
        {title:req.params.articleTitle},
        {title: req.body.title,
        content: req.body.content},
        {overwritten:true},function(err)
        {
            if(!err)
            res.send("successfully updated");
        }
    )
   })
   .patch((req,res)=>{
    Article.updateMany(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err)
        {
            if(!err)
            res.send("successfully updated");
            else 
            res.send(err);
        }
    )
   })
   .delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err)
        {
            if(!err)
            res.send("deleted Successfuly");
            else
            res.send(err);
        }
    )
   });
app.listen(3000,()=>{


    console.log("server running at port 3000");
})