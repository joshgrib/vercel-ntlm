const ntlm = require('express-ntlm')

module.exports = function (options, req, res, callback) {
  const ntlmMiddleware = ntlm(options)

  // recreate express stuff used in the middleware
  res.sendStatus = statusCode => res.status(statusCode).send()
  req.protocol = req.headers['x-forwarded-proto']
  req.originalUrl = req.url
  req.get = property => req.headers[property]
  req.connection.id = req.query.connectionId
  res.locals = {}

  ntlmMiddleware(req, res, callback)
}