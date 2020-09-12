import { MongoClient } from 'mongodb';

if (process.env.MONGO_URL === undefined) {
    throw new Error('MONGO_URL environment variable must be defined!');
}

const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoclient = client.connect();
export default mongoclient;
