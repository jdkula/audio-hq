import { GridFSBucket } from 'mongodb';
import mongoclient from './mongoclient';

const mongofiles = mongoclient.then((mongo) => mongo.db('audio-hq-files')).then((db) => new GridFSBucket(db));
export default mongofiles;
