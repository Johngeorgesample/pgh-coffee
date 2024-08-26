const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy()({
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  }
})
