import mongodb from './mongodb';

const mongoworkspaces = mongodb.then((db) => db.collection('workspaces'));
export default mongoworkspaces;
