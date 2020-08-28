import { NextApiHandler } from 'next';
import { convert, processFile } from '~/lib/processor';
import formidable from 'formidable';
import type { ConvertOptions } from '~/lib/useFileManager';

const Convert: NextApiHandler = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = '/tmp/audio-hq';
    form.keepExtensions = true;
    const parsePromise = new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    const { fields, files } = await parsePromise;

    for (const filename of Object.keys(files)) {
        const file = files[filename];
        const name = fields.name as string;
        const description = fields.description as string | undefined;

        const path = fields.path as string | undefined;
        const parsedPath: string[] | undefined = path && JSON.parse(path);

        const options = fields.options as string | undefined;
        const parsedOptions: ConvertOptions | undefined = options && JSON.parse(options);

        const workspace: string = fields.workspace as string;

        const job = await processFile({ name, workspace, path: parsedPath, description }, (id) =>
            convert(file.path, id, parsedOptions),
        );

        res.status(200).send(job);
        return;
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default Convert;
