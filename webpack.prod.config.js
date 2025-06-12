const path = require('path');
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('webpack-prod', {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
    },
  },
});
