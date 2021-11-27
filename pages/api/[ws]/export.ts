import Axios from 'axios';
import { NextApiHandler } from 'next';
import { Readable } from 'stream';
import { AppFS, isRedirect } from '~/lib/filesystems/FileSystem';
import { findOrCreateWorkspace } from './index';
import archiver from 'archiver';
import fs from 'fs';
import { File } from '~/lib/Workspace';

const ExportWorkspace: NextApiHandler = async (req, res) => {
    res.status(403).send('Disabled method.');
    return;

    // TODO: This wrecks servers and should happen on the client side probably.

    const organized = !!req.query.organized;

    const nameFn = (f: Pick<File, 'id' | 'name' | 'path'>): archiver.ZipEntryData => {
        if (organized) {
            return {
                name:
                    '/audio/' +
                    f.path.map((s) => s.replaceAll('/', '|')).join('/') +
                    '/' +
                    f.name.replaceAll('/', '|') +
                    '.mp3',
            };
        }
        return { name: f.id };
    };

    const workspace = await findOrCreateWorkspace(req.query.ws as string);
    const filePromises = await Promise.all(
        workspace.files.map(async (f) => ({ id: f.id, name: f.name, path: f.path, info: await AppFS.read(f.id) })),
    );
    const reqInfo =
        (req.socket.remotePort ?? 0) + '.' + (req.socket.localPort ?? 0) + '.' + (req.socket.remoteAddress ?? 'remote');
    const fileName = '/tmp/audio_hq_export_' + reqInfo + '_' + Date.now() + '.zip';
    const out = fs.createWriteStream(fileName);
    const archive = archiver('zip', { zlib: { level: 0 } });

    const archiveFinished = new Promise((resolve, reject) => {
        archive.on('error', reject);
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn(err);
            } else {
                reject(err);
            }
        });

        out.on('close', resolve);
    });

    archive.pipe(out);

    const fileProms = [];
    for (const fileInfo of filePromises) {
        fileProms.push(
            (async () => {
                if (isRedirect(fileInfo.info)) {
                    const res = await Axios.get(fileInfo.info.redirect, { responseType: 'arraybuffer' });
                    archive.append(Buffer.from(res.data, 'binary'), nameFn(fileInfo));
                } else {
                    archive.append(fileInfo.info.stream, nameFn(fileInfo));
                }
                const filei = workspace.files.findIndex((f) => f.id === fileInfo.id);
                workspace.files[filei].id = nameFn(fileInfo).name;
            })(),
        );
    }

    await Promise.all(fileProms);
    archive.append(JSON.stringify(workspace), { name: 'workspace.json' });

    archive.finalize();

    await archiveFinished;

    const rs = fs.createReadStream(fileName);
    rs.on('close', () => {
        fs.rmSync(fileName);
    });

    const stat = fs.statSync(fileName);
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename=audio_hq_export_${encodeURIComponent(workspace.name)}.zip`,
    });
    rs.pipe(res);
};

export default ExportWorkspace;
