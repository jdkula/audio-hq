'use client';

import { FC, ReactNode, useEffect, useState } from 'react';

const ClientOnly: FC<{ children: ReactNode }> = ({ children }) => {
    const [render, setRender] = useState(false);
    useEffect(() => {
        setRender(true);
    }, []);
    if (!render) return null;
    return children;
};

export default ClientOnly;
