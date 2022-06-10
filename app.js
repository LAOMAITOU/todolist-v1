const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");

const app=express();

const items=["Buy Food","Cook Food","Eat Food"];
const workitems=[];
const otheritems=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set('view engine', 'ejs');

app.get("/", function(req,res){
    
    let day=date.getDate();
    res.render("list",{listTitle:day,newListItems:items});

})

app.get("/work", function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workitems})
})

app.get("/others", function(req,res) {
    res.render("list",{listTitle:"Other List",newListItems:otheritems})
})

app.get('/about', function(req,res){
    res.render("about")
})

app.post("/", function(req,res){
    if(req.body.list==="Work"){
        var workitem=req.body.newItem;
        workitems.push(workitem);
        res.redirect("/work");
    } else if(req.body.list==="Other"){
        var otheritem=req.body.newItem;
        otheritems.push(otheritem);
        res.redirect("/others");
    } else {
        var item=req.body.newItem;
        items.push(item);
        res.redirect("/")
    }
})

app.listen(3000,function(req,res){
    console.log("The server is running on port 3000");
})