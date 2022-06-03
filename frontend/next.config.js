const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    webpack: (config, { isServer }) => {
        if (isServer) return config;
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
