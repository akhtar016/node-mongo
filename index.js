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
const users = ["Asad", "Moin", "Sabed", "Susmita", "Sohana", "Sabana"];

app.get("/products", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");

    collection.find().limit(10).toArray((err, documents) => {
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

app.get("/users/:id", (req, res) => {
  console.log(req.params);

  const userId = req.params.id;
  const name = users[userId];
  res.send({ userId, name });
});

//post
app.post("/addProduct", (req, res) => {
  // save to database
  const product = req.body;


  client = new MongoClient(uri, { useNewUrlParser: true });
  
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.insertOne(product, (err, result) => {
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
