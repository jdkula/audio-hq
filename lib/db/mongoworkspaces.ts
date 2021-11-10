import type { StoredWorkspace } from '../Workspace';
import mongodb from './mongodb';

const mongoworkspaces = mongodb.then((db) => db.collection<StoredWorkspace>('workspaces'));
export default mongoworkspaces;
