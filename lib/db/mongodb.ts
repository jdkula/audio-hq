import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL!, { useNewUrlParser: true, useUnifiedTopology: true });

const mongodb = client.connect().then((mongo) => mongo.db('audio-hq'));
export default mongodb;
