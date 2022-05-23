import mongoclient from './mongoclient';

const mongodb = mongoclient.then((mongo) => mongo.db('audio-hq'));
export default mongodb;
