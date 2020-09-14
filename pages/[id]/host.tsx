import { NextPage } from 'next';
import { useEffect } from 'react';

const Host: NextPage = () => {
    useEffect(() => {
        window.location.replace('.');
    }, []);
    return null;
};

export default Host;
