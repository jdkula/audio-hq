const path = require("path");

module.exports = {
    webpack: config => {
        config.resolve.alias["~"] = path.resolve(__dirname);
        config.resolve.alias["@graphql"] = path.resolve(__dirname, "graphql", "docs");

        config.module.rules.push({
            test: /\.graphql$/,
            use: [{
                loader: 'graphql-tag/loader'
            }]
        });
        return config;
    }
}
