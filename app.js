const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const moment = require('moment');


const app = express();



app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"))

app.set("view engine","ejs");



mongoose.connect("mongodb+srv://Admin:Admin123@cluster0.bb2syko.mongodb.net/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);



const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("list",listSchema);


const item1 = new Item({
  name : "Playing"
});

const item2 = new Item({
  name : "Reading"
});

const item3 = new Item({
  name : "Partying"
});

const defaultItem = [item1,item2,item3];

var now = new Date();
var dateString = moment(now).format('YYYY-MM-DD');

app.get("/", function(req,res){



 List.findOne({name:dateString},function(err,foundItems){
    if(err)
    {
      console.log(err);
    }
    else{

      var retVal = []

    if(foundItems != null)
    {
      retVal = foundItems.items;
    }
    console.log(retVal);
    res.render("list",{date: dateString , items : retVal});
    }
  })

});

app.post("/", async function(req,res){

  try{

  var itemFound = req.body.listItem;

  var currentDate= String(req.body.currentDate);

  dateString = currentDate;

  // console.log(itemFound);
  //
  // console.log(currentDate);

  const item1 = new Item({
    name : itemFound
  });

 await List.findOne({name:currentDate},  function(err,foundItem){
    if(!err)
    {
      if(!foundItem)
      {

          const listItem = new List({
          name: currentDate,
          items: item1

        });

         listItem.save();
      }
      else
      {

          foundItem.items.push(item1);
           foundItem.save();

      }
    }
  }).clone();

  res.redirect("/");

}
catch(error)
{
  console.log(error);
}


});

app.post("/fetch", function(req,res)
{
  var currentDate= req.body.currentDate;

  //console.log(currentDate);

  List.findOne({name:currentDate},function(err,foundItems){
    if(!err)
    {
      //console.log(foundItems);
      var obj = [];

      if(foundItems == null)
      obj = [];
      else
      obj = foundItems.items;

      res.render("list",{date: currentDate, items : obj});

  }
  else{
    console.log(err);
  }

});

});

app.post("/delete",function(req,res){

  var idChecked = req.body.checkbox;

  var currentDate = req.body.hidden;

  dateString = currentDate;

  List.findOneAndUpdate({name:currentDate},{$pull: {items:{_id :idChecked }}},function(err,result){
  if(!err)
   {
        res.redirect("/");
    }

  })

})

const PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
  console.log("Server is running at port 3000");
})
