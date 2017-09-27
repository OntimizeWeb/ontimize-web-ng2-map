const helpers = require('./helpers');
const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ngToolsWebpack = require('@ngtools/webpack');

const { GlobCopyWebpackPlugin, NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');


const config = {
    entry: {
        main: helpers.root('src/main-aot.ts'),
        polyfills: helpers.root('src/polyfills.ts'),
        vendor: helpers.root('src/vendor-aot.ts'),
        scripts: [
            helpers.root('src/assets/js/domchange.js'),
            helpers.root('src/assets/js/keyboard.js')
        ]
    },

    // devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        // path: helpers.root('dist'),
        filename: '[name].[chunkhash].bundle.js',
        sourceMapFilename: '[name].[chunkhash].bundle.map',
        chunkFilename: '[id].[chunkhash].chunk.js'
    },


    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        rules: [
            {
                enforce: "pre", test: /\.js$/, loader: "source-map-loader",
                exclude: [/(\\|\/)node_modules(\\|\/)/]
            },
            { test: /\.(html|css)$/, loader: 'raw-loader', exclude: /\.async\.(html|css)$/ },
            { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
            { test: /\.(eot|svg|cur)$/, loader: "file-loader?name=[name].[hash:20].[ext]" },
            { test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/, loader: "url-loader?name=[name].[hash:20].[ext]&limit=10000" },
            { test: /\.ts$/, loader: '@ngtools/webpack', exclude: /\.node_modules/ }
        ]
    },
    plugins: [
        new ProgressPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'scripts', 'vendor', 'polyfills']
        }),

        new CommonsChunkPlugin({
            "name": ["inline"],
            "minChunks": null
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
            },
            "chunks": ["main"]
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),

        new webpack.optimize.CommonsChunkPlugin({
            "name": ["main"],
            "minChunks": 2,
            "async": "common"
        }),

        new ngToolsWebpack.AotPlugin({
            tsConfigPath: helpers.root('tsconfig.aot.json'),
            entryModule: helpers.root('src/app/app.module#AppModule')
        }),

        new HtmlWebpackPlugin({
            template: helpers.root('config/index.ejs')
        }),

        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            beautify: false,
            output: { comments: false },
            mangle: { keep_fnames: true, screw_ie8: true },
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false // we need this for lazy v8
            }
        }),

        new GlobCopyWebpackPlugin({
            "patterns": [
                "assets/css/loader.css",
                "assets/i18n",
                "assets/images",
                "favicon.ico",
                {
                    "glob": "**/*",
                    "input": "../node_modules/leaflet/dist/images",
                    "output": "./assets/"
                },
                {
                    "glob": "**/*",
                    "input": "../node_modules/flag-icon-css/flags/",
                    "output": "./assets/flags"
                }
            ],
            "globOptions": {
                "cwd": path.join(process.cwd(), "src"),
                "dot": true,
                "ignore": "**/.gitkeep"
            }
        })
    ]
};

module.exports = config;
