const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://db_user3:4iHo6Y1XXdwwZd1y@cluster0.du4va.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    const userCollection = client.db("auto_parts").collection("users");
    const carPartsCollection = client.db("auto_parts").collection("carparts");
    const reviewsCollection = client.db("auto_parts").collection("reviews");

    // services api
    app.post("/carparts", async (req, res) => {
      const parts = req.body;
      if (!parts.partsname || !parts.price) {
        return res.send({ success: false, error: "Please provide all info" });
      }
      const result = await carPartsCollection.insertOne(parts);
      res.send({
        success: true,
        message: `inserted succesfully ${parts.partsname}`,
      });
    });

    app.get("/carparts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carPartsCollection.findOne(query);
      res.send({ success: true, result: result });
    });
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.send({
        success: true,
        message: " Thank you ",
      });
    });

    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find().toArray();
      res.send(reviews);
    });

    app.get("/carparts", async (req, res) => {
      const carParts = await carPartsCollection.find().toArray();
      res.send(carParts);
    });
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });
    app.put("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      const requesterAccount = await userCollection.findOne({ email: email });
      if (requesterAccount.role === "admin") {
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      } else {
        res.send({ message: "forbidden" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
run();

app.get("/", (req, res) => {
  res.send("Running carHouse server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
