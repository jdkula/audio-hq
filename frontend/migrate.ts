import { mongo } from './common/db/mongodb';
import { ObjectId } from 'mongodb';

import { data } from './export.json';

(async () => {
    const db = await mongo;
    for (const workspace of data.workspace) {
        const inserted = await db.workspaces.insertOne({
            createdAt: new Date(workspace.created_at).getTime(),
            updatedAt: new Date(workspace.updated_at).getTime(),
            name: workspace.name,
        });
        const oid = inserted.insertedId;

        for (const dirent of workspace.dirents) {
            if (dirent.folder) {
                await db.entries.insertOne({
                    _workspace: oid,
                    folder: {
                        name: dirent.name,
                        ordering: dirent.ordering,
                        path: dirent.path,
                    }
                });
            } else if (dirent.single) {
                await db.entries.insertOne({
                    _workspace: oid,
                    single: {
                        name: dirent.name,
                        ordering: dirent.ordering,
                        path: dirent.path,
                        
                    }
                })
            }
        }
    }
})();
