const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-dev', {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
    },
  },
});
