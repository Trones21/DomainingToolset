//Not using merge, currently setup in a way that requires config and prod to both contain entire config
//#Project for another day

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    Index: './frontend/index.ts',
    Search: './frontend/SearchTools.ts',
    Permutator: './frontend/Permutator.ts',
    Contact: './frontend/Contact.ts',
  },
  plugins: [
    new HtmlWebpackPlugin({
      includeChunks: ['Index'],
      filename: 'index.html',
      title: "Home",
      template: './frontend/index.html'
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['Permutator'],
      filename: 'Search.html',
      title: "Bulk Search",
      template: './frontend/Search.html'
    }),
    new HtmlWebpackPlugin({
      includeChunks: ['Permutator'],
      filename: 'Permutator.html',
      title: "Permutator",
      template: './frontend/Permutator.html'
    }),
    new HtmlWebpackPlugin({
      includeChunks: ['Contact'],
      filename: 'Contact.html',
      title: "Contact",
      template: './frontend/Contact.html'
    }),
    new HtmlWebpackPlugin({
      includeChunks: ['Resources'],
      filename: 'Resources.html',
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
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
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
