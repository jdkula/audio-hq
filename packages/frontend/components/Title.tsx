'use client';

import { FC, useEffect } from 'react';

const Title: FC<{ children: string }> = ({ children }) => {
    useEffect(() => {
        window.document.title = children;
    }, [children]);
    return null;
};

export default Title;
