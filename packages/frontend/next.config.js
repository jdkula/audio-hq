const { InjectManifest } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (isServer) return config;

        // Configures the service worker with files to cache
        config.plugins.push(
            new InjectManifest({
                swSrc: `${__dirname}/src/service.worker.js`,
                swDest: `${__dirname}/public/service.worker.dist.js`,
                exclude: [/manifest\.json$/],
            }),
        );

        return config;
    },
};
