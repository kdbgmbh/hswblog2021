const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const mode = (process.env.NODE_ENV || 'development').toLowerCase();

// Determine mode we are running in
const dev = 'development' === mode;
const prod = 'production' === mode;

if (!dev && !prod) {
    throw new Error(`Unknown execution mode: ${mode}.`);
}

// The webpack configuration
module.exports = {
    // mode controls several webpack optimizations
    // Is either 'production' or 'development'
    mode,

    // What development tool to use?
    // In development, webpack will emit source maps mapping the compiled
    // JavaScript back to Svelte code to enable browser debugging
    // In production, no debugging information is emitted
    devtool: dev ? 'source-map' : false,

    // Files to bundle
    entry: {
        // 'main' is our primary entry point
        main: './src/mount.js',
    },

    // How to emit the compiled JavaScript
    output: {
        // Put it into the `build` folder
        path: path.resolve(__dirname, 'build'),

        // Patterns for created files and created chunks
        filename: '[name].hsw.js',
        chunkFilename: '[name].hsw.js',

        // In production, we will serve the application from /
        // webpack will set paths in the compiled JavaScript accordingly
        publicPath: '/',
    },

    // Starting from the entry point, how do we locate files?
    resolve: {
        // Look for several file extensions
        // .mjs is created by Svelte
        extensions: ['.mjs', '.svelte', '.js'],

        // Exports to use when importing files
        mainFields: ['svelte', 'module', 'browser', 'main'],

        // We can create aliases when importing files
        alias: {},
    },

    // In development, webpack will provide a web server
    devServer: {
        // Host and port to accessit
        host: '0.0.0.0',
        port: 3002,

        // Any files not handled by webpack will be in the `static` folder
        contentBase: path.resolve(__dirname, 'static'),

        // If a file is not found, serve the index.html instead
        historyApiFallback: true,

        // Don't check for any host names to have it accessible
        // from anywhere
        disableHostCheck: true,

        // webpack also has proxy server capabilities
        proxy: {
            // Proxy anything under /api to the node.js API
            '/api': {
                // That's where the API is
                target: 'http://localhost:3001',

                // Remove the /api prefix
                pathRewrite: { '^/api': '' },

                // Change the origin headers to prevent CORS issues
                changeOrigin: true,

                // We are not using TLS
                secure: false,
            },
        },
    },

    // Define how to compile files
    module: {
        // Rules for compilation
        rules: [
            // #1: Svelte files
            {
                // Check for files ending in .svelte
                test: /\.svelte$/,
                // Use the svelte loader and tell it whether in development or production mode
                use: {
                    loader: 'svelte-loader',
                    options: {
                        dev,
                    },
                },
            },

            // #2: CSS files
            {
                // Find files ending in .css
                // Extract them into standalone CSS files and inject
                // them into the application
                test: /\.css$/,
                sideEffects: true,
                use: [MiniCSSExtractPlugin.loader, 'css-loader'],
            },

            // #3: Files we cannot handle / do not compile
            {
                test: /\.(ttf|otf|woff2?)$/,
                // Inject them or reference them
                use: 'file-loader',
            },
        ],
    },

    // Plugins for the compilation
    plugins: [
        // DefinePlugin allows to define global variables that will be
        // replaced with their value during compilation
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(dev),
        }),

        // The HtmlWebpackPlugin generates a HTML file with all resources created by
        // webpack
        new HtmlWebpackPlugin({
            template: 'index.tpl.html',
            hash: true,
            minify: true,
        }),

        // MiniCSSExtractPlugin extracts embedded CSS into CSS files
        new MiniCSSExtractPlugin({
            filename: '[name].hsw.css',
        }),
    ],

    // Optimization parameters for the compilation
    optimization: {
        // Configuration to split JavaScript files
        splitChunks: {
            cacheGroups: {
                // Create a `vendor` file
                vendor: {
                    // Put everything from node_modules into it
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            },
        },

        // Only minimize JavaScript in production
        // (it's slow)
        minimize: prod,
    },
};
