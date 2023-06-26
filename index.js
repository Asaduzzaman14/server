const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;




app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.dci89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 }
});


console.log('hello');

// Send a ping to confirm a successful connection

async function run() {

 await client.connect();

 const optionsCollection = client.db('select-box').collection('options')

 app.get("/all-options", async (req, res) => {
  const cursor = optionsCollection.find({});
  const result = await cursor.toArray();
  res.send({ status: true, data: result });
 });



 app.patch("/addData/:id", async (req, res) => {

  const optionId = req.params.id;
  const user = req.body;

  // const optionId = "64987737cce0b1c268b6f07f";
  // const user = { name: 'update', option: 'Manufacturing', agree: true };

  console.log(optionId);
  console.log(user);
  const updateDoc = {
   $set: {
    "user": user,
   },
  };

  const result = await optionsCollection.updateOne(
   { _id: new ObjectId(optionId) },
   updateDoc,
  );

  if (result.acknowledged) {
   return res.send({ status: true, data: result });
  }
  res.send({ status: false });
 });



 app.patch("/updateData/:id", async (req, res) => {

  const optionId = req.params.id;
  const data = req.body;

  // const optionId = "64987737cce0b1c268b6f07f";
  // const user = { name: 'update', option: 'Manufacturing', agree: true };

  console.log(optionId);
  console.log(data);

  const updateDoc = {
   $set: {
    "user.name": data.name,
   },
  };

  const result = await optionsCollection.updateOne(
   { _id: new ObjectId(optionId) },
   updateDoc,
  );

  if (result.acknowledged) {
   return res.send({ status: true, data: result });
  }
  res.send({ status: false });
 });





}


// run server
run().catch(console.dir);


app.get('/', (req, res) => {
 res.send('server is runing')
})

app.listen(port, () => {
 console.log(`App is litening on ${port}`);
})
