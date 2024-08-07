const { withPlausibleProxy } = require('next-plausible')


module.exports = withPlausibleProxy()({
  // ...your next js config, if any
  // Important! it is mandatory to pass a config object, even if empty
})
