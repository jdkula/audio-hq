import { mongo } from 'service/lib/db/mongodb';
import { data } from '../secret-export.json';
import { pino } from 'pino';

const log = pino({ name: 'migration', transport: { target: 'pino-pretty' }, level: 'trace' });

(async () => {
    const db = await mongo;
    for (const workspace of data.workspace) {
        log.info('Importing Workspace %s', workspace.id);
        const inserted = await db.workspaces.insertOne({
            createdAt: new Date(workspace.created_at).getTime(),
            updatedAt: new Date(workspace.updated_at).getTime(),
            name: workspace.name,
        });
        const workspaceId = inserted.insertedId;

        for (const dirent of workspace.dirents) {
            log.debug('Importing dirent %s into workspace %s', dirent.id, workspace.id);
            if (dirent.folder) {
                await db.entries.insertOne({
                    _workspace: workspaceId,
                    name: dirent.name,
                    ordering: dirent.ordering,
                    path: dirent.path,
                    isFolder: true,
                });
            } else if (dirent.single) {
                await db.entries.insertOne({
                    _workspace: workspaceId,
                    isFolder: false,
                    name: dirent.name,
                    ordering: dirent.ordering,
                    path: dirent.path,
                    single: {
                        description: dirent.single.description,
                        duration: dirent.single.length,
                        provider_id: dirent.single.provider_id,
                        source: dirent.single.source_url ?? '',
                        url: dirent.single.download_url,
                    },
                });
            }
        }
    }
    log.info('Done');
    (await mongo).client.close();
})();
