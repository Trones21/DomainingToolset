const path = require('path');
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    Search: './frontend/SearchTools.ts',
    Permutator: './frontend/Permutator.ts',
    Contact: './frontend/Contact.ts',
  },
  plugins: [
    new HtmlWebpackPlugin({
      excludeChunks: ['Permutator'],
      filename: 'Search',
      title: "Bulk Search",
      template: './frontend/Search.html'
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['Search'],
      filename: 'Permutator',
      title: "Permutator",
      template: './frontend/Permutator.html'
    }),
    new HtmlWebpackPlugin({
      includeChunks: ['Contact'],
      filename: 'Contact',
      title: "Contact",
      template: './frontend/Contact.html'
    }),
    new HtmlWebpackPlugin({
      includeChunks: ['Resources'],
      filename: 'Resources',
      title: "Resources",
      template: './frontend/Resources.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'fr_dist'),
  },
  devServer: {
    inline: false,
    contentBase: './fr_dist'
  },
}


// module.exports = mode => {

//  const pages= [
//    parts.page({title:"Search"}),
//   //  parts.page({title:"Permutator"})
//  ];

//  const config = 
//  mode === "production" ? prodConfig : devConfig;

//   return pages.map(page =>
//     merge(config, page, { mode:"development" })
//   );
// };
