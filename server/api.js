const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { MongoClient, ObjectId } = require('mongodb');
const MONGODB_URI = "mongodb+srv://victormenu:AS0EppY8T1PQnpPY@cluster0.mpalatz.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);


app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(MONGODB_DB_NAME);
  try {
    const collection = db.collection('products');
    const product = await collection.findOne({ _id: ObjectId(productId) });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found or not existing' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});


app.get('/products/search', async (request, response) => {
  try {

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');

    let limit = request.query.limit || undefined;
    let brand = request.query.brand || undefined;
    let price = request.query.price || undefined;
    let query = {};

    if(limit !== undefined) {
      query.limit = limit;
    }
    if(brand !== undefined) {
      query.brand = brand;
    }
    if(price !== undefined) {
      query.price = {$lte: parseInt(price)};
    }

    let prods = await collection
        .find(query)
        .limit(parseInt(limit))
        .sort({price: 1})
        .toArray();

    response.send({result: prods});

  } catch(e) {
    response.send({error: "Error : Incorrect arguments"});
    console.log(e);
  }

});