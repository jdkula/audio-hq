import { NextApiHandler } from 'next';
import Jobs from '~/lib/jobs';

const GetJob: NextApiHandler = async (req, res) => {
    res.json(Jobs.get(req.query.jobid as string));
};

export default GetJob;
