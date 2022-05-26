const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://db_user2:QOSfIz2lPh2pKSzM@cluster0.du4va.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
  } finally {
  }
}
app.get("/", (req, res) => {
  res.send("Hello From auto parts!");
});
app.listen(port, () => {
  console.log(`Auto parts listening on port ${port}`);
});
