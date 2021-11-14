const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4i3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("photographyCamera");
    const servicesCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");

    // post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    // get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get api for a single data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleOrderInfo = await servicesCollection.findOne(query);
      res.send(singleOrderInfo);
    });

    // post api for place order
    app.post("/orders", async (req, res) => {
      const placeOrder = req.body;
      const result = await orderCollection.insertOne(placeOrder);
      res.json(result);
    });

    // get api for place order
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const myOrder = await orderCollection.find({ email }).toArray();
      res.send(myOrder);
    });

    // delete api for my order
    app.delete("/orders/:id", async (req, res) => {
      const orderId = req.params.id;
      const query = { _id: ObjectId(orderId) };
      const deleteAnOrder = await orderCollection.deleteOne(query);
      res.json(deleteAnOrder);
    });

    // get api for all order
    app.get("/orders", async (req, res) => {
      const manageorder = await orderCollection.find({}).toArray();
      // console.log(manageorder);
      res.send(manageorder);
    });

    // update api for status
    app.put("/orders/:id", async (req, res) => {
      const statusId = req.params.id;
      const updatedStatus = req.body;
      // console.log(updatedStatus);
      const filter = { _id: ObjectId(statusId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const approvedStatus = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log(approvedStatus);
      res.json(approvedStatus);
    });

    // post api for review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // get api for all data
    app.get("/reviews", async (req, res) => {
      const allReview = await reviewCollection.find({}).toArray();
      res.send(allReview);
    });

    // end here
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running camara Server");
});

app.listen(port, () => {
  console.log("running camara server on port", port);
});
