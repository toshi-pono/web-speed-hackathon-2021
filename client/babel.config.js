module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        modules: 'auto',
        targets: 'last 1 Chrome major version',
        useBuiltIns: 'usage',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: false,
      },
    ],
  ],
};
