module.exports = {
  plugins: [
    require('postcss-import'),
    require('stylelint')({
      "quietDeprecationWarnings": true
    }),
    require('postcss-reporter')({ "clearReportedMessages": true }),
    require('postcss-preset-env')({ stage: 1 }),
    require('cssnano')
  ]
};
