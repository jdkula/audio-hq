import { NextApiHandler } from 'next';
import Jobs from '~/lib/Jobs';

const GetJob: NextApiHandler = async (req, res) => {
    res.json(Jobs.get(req.query.jobid as string));
};

const JobEndpoint: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {
        await GetJob(req, res);
    } else if (req.method === 'DELETE') {
        Jobs.set(req.query.jobid as string, null);
        res.status(204).end();
    }
};

export default JobEndpoint;
