const express = require("express");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"))

app.set("view engine","ejs");

var items = ["watching movies","reading"];
app.get("/", function(req,res){

  var today = new Date();

  var options ={
    weekday : 'long',
    day: 'numeric',
    month: 'long'
  };

  var day = today.toLocaleDateString("en-US",options);


  res.render("list",{kindOfDay : day, items : items});

});

app.post("/", function(req,res){

  var item = req.body.listItem;

  items.push(item);

  res.redirect("/");

});


app.listen(3000,function(){
  console.log("Server is running at port 3000");
})
