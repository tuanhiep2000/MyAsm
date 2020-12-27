const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
var Regex = require("regex");
const port = 3000;
var MongoClient = require('mongodb').MongoClient;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('hbs', handlebars({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


app.get('/home', (req, res) => {
      res.render('home');
})

var url = 'mongodb+srv://tuanhiep:16052106@cluster0.e5s4a.mongodb.net/test';
app.get('/manageProduct', async(req,res) => {
      let client = await MongoClient.connect(url);
      let dbo = client.db("MyDatabase");
      let results = await dbo.collection("ProductDB").find({}).toArray();
      res.render('manageProduct', {model:results});
})

app.get('/insert', (req, res) => {
      res.render('newProduct');
})

app.post('/doInsert', async(req,res) => {
      
      let imageInput = req.body.txtImage;
      let nameInput = req.body.txtName;
      let priceInput = req.body.txtPrice;
      let trademarkInput = req.body.txtTrademark;
      let amountInput = req.body.txtAmount;
      let totalInput = req.body.txtTotal;

      let client = await MongoClient.connect(url);
      let dbo = client.db("MyDatabase");
      let newProduct = {image : imageInput, name : nameInput, price : priceInput, trademark : trademarkInput, amount : amountInput, total : totalInput};
      await dbo.collection("ProductDB").insertOne(newProduct);
      res.redirect('/manageProduct');
})

app.get('/update', async(req, res) => {
      let id = req.query.id;
      var ObjectID = require('mongodb').ObjectID;

      let client= await MongoClient.connect(url);
      let dbo = client.db("MyDatabase");
      let result = await dbo.collection("ProductDB").findOne({"_id" : ObjectID(id)});
      res.render('updateProduct', {model:result});
})

app.post('/doUpdate',async (req,res)=>{
      let id = req.body.id;
      let imageInput = req.body.txtImage;
      let nameInput = req.body.txtName;
      let priceInput = req.body.txtPrice;
      let trademarkInput = req.body.txtTrademark;
      let amountInput = req.body.txtAmount;
      let totalInput = req.body.txtTotal;
      
      let newValues ={$set : {image : imageInput, name : nameInput, price : priceInput, trademark : trademarkInput, amount : amountInput, total : totalInput}};
      var ObjectID = require('mongodb').ObjectID;
      let condition = {"_id" : ObjectID(id)};
      
      let client= await MongoClient.connect(url);
      let dbo = client.db("MyDatabase");
      await dbo.collection("ProductDB").updateOne(condition,newValues);
      
      res.redirect('/manageProduct');
})

app.post('/doSearch',async (req,res)=>{
      let nameInput = req.body.txtName;
      let client = await MongoClient.connect(url);  
      let dbo = client.db("MyDatabase");  
      let results = await dbo.collection("ProductDB").find({name: {$regex: nameInput}}).toArray();
      res.render('manageProduct', {model:results})
})


app.get('/delete', async(req,res) => {
      let id = req.query.id;
      var ObjectID = require('mongodb').ObjectID;
      let condition = {"_id" : ObjectID(id)};

      let client = await MongoClient.connect(url);
      let dbo = client.db("MyDatabase");
      await dbo.collection('ProductDB').deleteOne(condition);
      res.redirect('/manageProduct');
})


app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}/home`)
})

  
