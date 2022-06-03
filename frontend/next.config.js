const { InjectManifest } = require('workbox-webpack-plugin');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
    webpack: (config, { isServer }) => {
        if (isServer) return config;
        config.plugins.push(
            new InjectManifest({
                swSrc: `${__dirname}/src/service.worker.js`,
                swDest: `${__dirname}/public/service.worker.dist.js`,
            }),
        );

        return config;
    },
};
