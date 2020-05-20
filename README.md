# vercel-ntlm

An NTLM "middleware" for use in a Vercel serverless function to handle Active Directory authentication. There isn't true support for middleware as far as I've seen, so you need to call it as a wrapper inside each request handler

This is just a wrapper around [`express-ntlm`](https://github.com/einfallstoll/express-ntlm) that adds a few properties on the `request` and `response` objects that are expected by `express-ntlm` but not supplied by Vercel for their serverless functions.

> TODO: Right now you have to generate and send a connection ID in the query string because I haven't been able to find a connection ID on Vercel's request object

## Usage

```js
// api/auth.js
const ntlmAuth = require('vercel-ntlm')

const ntlmOptions = {
  domain: 'MyDomain',
  domaincontroller: 'ldap://MyDomain.com'
}
module.exports = (req, res) => {
  ntlmAuth(ntlmOptions, req, res, () => {
    res.json(req.ntlm)
  })
}
```

```html
<!-- /public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>vercel-ntlm</title>
</head>
<body>
  <p id="message">Waiting for authentication...</p>
</body>
<script>
  const updateMessage = msg => document.getElementById('message').innerText = msg;

  const randomInt = Math.floor(Math.random() * Math.floor(100000))
  fetch(`/api/auth?connectionId=${randomInt}`)
    .then(response => response.json())
    .then(response => {
      updateMessage(`You are authenticated! ${JSON.stringify(response)}`);
    }).catch(e => {
      updateMessage(`Unable to authenticate: ${e}`);
    })
</script>
</html>
```
