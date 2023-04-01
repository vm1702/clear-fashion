const {MongoClient} = require('mongodb');
const MONGODB_URI = "mongodb+srv://victormenu:AS0EppY8T1PQnpPY@cluster0.mpalatz.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function connectToDatabase() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(MONGODB_DB_NAME);

    console.log('Connected to MongoDB database:', MONGODB_DB_NAME);
    await client.close();
    console.log('Disconnected from MongoDB database:', MONGODB_DB_NAME);
}

connectToDatabase().catch((error) => console.error(error));

const fs = require('fs');

async function insertProducts(db, products) {
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    console.log(`${result.insertedCount} products inserted`);
    console.log(result);
}

async function main() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        const directoryPath = 'C:/Users/vim17/Desktop/clear-fashion/server/scrapping';
        const files = await fs.promises.readdir(directoryPath);

        const promises = files.map(async (file) => {
            const data = await fs.promises.readFile(`${directoryPath}/${file}`);
            const products = JSON.parse(data);
            return insertProducts(db, products);
        });

        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

//main()


const brand = 'Montlimart';

// 1) Find all products related to a given brands

async function findProductsByBrand(db, brand) {
    const collection = db.collection('products');
    const products = await collection.find({ brand }).toArray();
    console.log(`Found ${products.length} products for brand '${brand}'`);
    console.log(products);
}

async function query1() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsByBrand(db, brand);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

// 2) Find all products less than a price

async function findProductsByPriceLessThan(db, price) {
    const collection = db.collection('products');
    const products = await collection.find({ price: { $lt: price } }).toArray();
    console.log(`Found ${products.length} products with price less than ${price}`);
    console.log(products);
}


async function query2() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsByPriceLessThan(db, 20);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

// 3) Find all products sorted by price

async function findProductsSortedByPrice(db, sortDirection = 1) {
    const collection = db.collection('products');
    const sort = { price: sortDirection };
    const products = await collection.find().sort(sort).toArray();
    console.log(`Found ${products.length} products sorted by price (in ${sortDirection === 1 ? 'ascending' : 'descending'} order)`);
    console.log(products);
}

async function query3() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsSortedByPrice(db,-1); //-1 to sort the result in descending order
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

// 4) Find all products sorted by date

async function findProductsSortedByDate(db, sortDirection = 1) {
    const collection = db.collection('products');
    const sort = { date: sortDirection };
    const products = await collection.find().sort(sort).toArray();
    console.log(`Found ${products.length} products sorted by date (in ${sortDirection === 1 ? 'ascending' : 'descending'} order)`);
    console.log(products);
}

async function query4() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsSortedByDate(db,1); //-1 to sort the result in descending order
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

// 5) Find all products scraped less than 2 weeks

async function findProductsScrapedLessThanTwoWeeksAgo(db) {
    const collection = db.collection('products');
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const products = await collection.find({ scraped_at: { $gte: twoWeeksAgo } }).toArray();
    console.log(`Found ${products.length} products scraped less than two weeks ago`);
    console.log(products);
}

async function query5() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsScrapedLessThanTwoWeeksAgo(db,1); //-1 to sort the result in descending order
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

query1()
query2()
query3()
query4()
query5()




