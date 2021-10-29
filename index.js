const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.DB_HOST || 8000;

/* 
traveler
Y6Ogi1kIUXDTkFwi */

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
    const service_collection = database.collection('service');
    console.log('connection success');

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
