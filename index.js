const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wn1l6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    //
    await client.connect();
    const database = client.db('traveler');
    // collection
    const service_collection = database.collection('service');
    const tour_collection = database.collection('submitted_tour');
    const events_collection = database.collection('events');
    const client_message_collection = database.collection('client_message');

    // post services
    app.post('/addservice', async (req, res) => {
      const service = req.body;
      const result = await service_collection.insertOne(service);
      res.json(result);
    });

    // get all services
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = service_collection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // get single service
    app.get('/service/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await service_collection.findOne(query);
      res.json(result);
    });

    // post single travel plan
    app.post('/submittedtour', async (req, res) => {
      const tour = req.body;
      const result = await tour_collection.insertOne(tour);
      res.json(result);
    });

    // get all tour order
    app.get('/allorders', async (req, res) => {
      const query = {};
      const cursor = tour_collection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    //delete journey
    app.delete('/removejourney/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await tour_collection.deleteOne(query);
      res.json(result);
    });

    //update status
    app.put('/updatestatus/:id', async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { status: data.status },
      };
      const result = await tour_collection.updateOne(query, updateDoc, options);
      res.json(result);
    });
    // get all event
    app.get('/events', async (req, res) => {
      const query = {};
      const cursor = events_collection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // client message
    app.post('/message', async (req, res) => {
      const message = req.body;
      const result = await client_message_collection.insertOne(message);
      res.json(result);
    });
  } finally {
    //
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('i am working');
});

app.listen(port, () => {
  console.log('server is running on port', port);
});
