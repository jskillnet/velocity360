var webpack = require("webpack")
var path = require('path')
var CommonsChunkPlugin = new require('webpack/lib/optimize/CommonsChunkPlugin')

module.exports = {

	entry: {
		home: './src/apps/client/Home.js',
		post: './src/apps/client/Post.js',
		tutorial: './src/apps/client/Tutorial.js'
	},
	output: {
		filename: 'public/dist/[name].js',
        sourceMapFilename: 'public/dist/[name].map'
	},
	devtool: '#source-map',	
	plugins: process.env.NODE_ENV === 'production' ? [
		new CommonsChunkPlugin({
			name: 'commons',
			chunks: ['home', 'post', 'tutorial']
		}),
	    new webpack.DefinePlugin({
	        'process.env': {
	        	'NODE_ENV': JSON.stringify('production')
	        }
	    }),
    	new webpack.optimize.UglifyJsPlugin({
    		minimize: true,
		    compress: {
		        warnings: true,
		        drop_console: true
		    }
    	})
	] : [
		new CommonsChunkPlugin({
			name: 'commons',
			chunks: ['home', 'post', 'tutorial']
		})
	],	
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query:{
					presets:['react', 'es2015']
				}
			}
		]
	}
}
