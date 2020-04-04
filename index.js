const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });


app.get("/products", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");

    collection.find().toArray((err, documents) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
      } else {
        res.send(documents);
      }
    });
    console.log("Database connected.....");
    client.close();
  });
});

app.get("/product/:key", (req, res) => {

  const key = req.params.key;

  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");

    collection.find({key}).toArray((err, documents) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
      } else {
        res.send(documents[0]);
      }
    });
    console.log("Database connected.....");
    client.close();
  });

  //const name = users[userId];
 // res.send({ userId, name });
  
});




app.post("/getProductsByKey", (req, res) => {

  const key = req.params.key;
  const productKeys = req.body;

  console.log(productKeys)

  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");

    collection.find({key: {$in: productKeys}}).toArray((err, documents) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
      } else {
        res.send(documents);
      }
    });
    console.log("Database connected.....");
    client.close();
  });

});


// Have to learn how to delete data
// Have to learn how to update data










//post
app.post("/addProduct", (req, res) => {
  // save to database
  const product = req.body;


  client = new MongoClient(uri, { useNewUrlParser: true });
  
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.insert(product, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
      } else {
        res.send(result.ops[0]);
        console.log("Successfully Inserted", result);
      }
    });
    console.log("Database connected.....");
    client.close();
  });
});





app.post("/placeOrder", (req, res) => {
  // save to database
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  console.log(orderDetails);


  client = new MongoClient(uri, { useNewUrlParser: true });
  
  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
      } else {
        res.send(result.ops[0]);
        console.log("Successfully Inserted", result);
      }
    });
    console.log("Database connected.....");
    client.close();
  });
});

const port = process.env.PORT || 4200;


app.listen(port, () => console.log("Listening to port 4200"));
