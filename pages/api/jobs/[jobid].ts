import { NextApiHandler } from 'next';
import { getJobStatus } from '~/lib/processor';

const GetJob: NextApiHandler = async (req, res) => {
    res.json(getJobStatus(req.query.jobid as string));
};

export default GetJob;
