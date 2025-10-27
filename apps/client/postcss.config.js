export default {
  plugins: {
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    cssnano: {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifySelectors: true,
      }],
    },
  },
};
