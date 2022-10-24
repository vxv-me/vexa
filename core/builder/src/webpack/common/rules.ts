import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const rules = () => {
  return [
    {
      test: /\.tsx?$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
    },
    {
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: `${packageName}_[contenthash]`,
            },
          } 
        },
      ],
    },
  ];
};
