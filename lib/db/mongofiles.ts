import { MongoClient, GridFSBucket } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL!, { useNewUrlParser: true, useUnifiedTopology: true });

const mongofiles = client
    .connect()
    .then((mongo) => mongo.db('audio-hq-files'))
    .then((db) => new GridFSBucket(db));

export default mongofiles;
