const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const lodash=require("lodash");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://maiiam:admin123@cluster0.31r0nhg.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true});

const itemsSchema={ 
    name:String
    };

const Item=mongoose.model("Item", itemsSchema);

const item1=Item({"name":"Welcome to the todo list"});
const item2=Item({"name":"Hit the + button to add a new item"});
const item3=Item({"name":"<- Hit this to delete an item"});

const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List=mongoose.model("List", listSchema);

app.get("/", function(req,res){
    Item.find({},function(err,founditems){
        if(founditems.length===0) {
            Item.insertMany(defaultItems, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("successfully inserted");
                }
            })
            res.redirect('/');
        } else {
            res.render("list",{listTitle:"Today",newListItems:founditems});
        }
    })

})

app.get('/:address',function(req,res){
    const customeListName=lodash.capitalize(req.params.address);
    List.findOne({name:customeListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list=new List({
                    name:customeListName,
                    items:defaultItems
                })
                list.save()
                res.redirect('/'+customeListName);
            } else {
                res.render("list",{listTitle:customeListName,newListItems:foundList.items});
            }
        }
    })
})

app.get('/about', function(req,res){
    res.render("about")
})

app.post("/", function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;

    const item=Item({"name":itemName});

    if(listName==="Today"){
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+listName);
        })
    }
    
})

app.post("/delete", function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(err){
                console.log(err);
            } else {
                console.log("successfully deleted");
            }
        })
        res.redirect('/');
    } else {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect('/'+listName);
            }
        })
    }

    
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(req,res){
    console.log("The server has started successfully");
})