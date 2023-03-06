const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
// const target = devMode ? 'web' : 'browserslist';
// если проект собирается в режиме разработки, то подключаем source-map
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
	mode,
	// target,
	devtool,
	devServer: {
		port: "auto",
		open: true,
		hot: true,
	},
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'asset/[name][ext]',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.(c|sa|sc)ss$/i,
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('postcss-preset-env')],
							},
						},
					},
					'group-css-media-queries-loader',
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]'
				}
			},
			{
				test: /\.(mp[3|4])$/i,
				type: 'asset/resource',
				generator: {
					filename: 'video/[name][ext]'
				}
			},
			// шрифты и SVG
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
			{
				test: /\.m?js$/i,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},

	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.squooshMinify,
					options: {
						encodeOptions: {
							mozjpeg: {
								// That setting might be close to lossless, but it’s not guaranteed
								// https://github.com/GoogleChromeLabs/squoosh/issues/85
								quality: 75,
							},
							webp: {
								lossless: 1,
							},
							avif: {
								// https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
								cqLevel: 0,
							},
						},
					},
				},
			}),
		],
	},
};