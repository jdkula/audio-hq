import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Host = () => {
    useEffect(() => {
        window.location.replace('.');
    }, []);
    return null;
};

export default Host;
