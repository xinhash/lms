## Steps to automate API testing

### Add following to collection

siteUrl and token variable

### Use Auth -> Login and update token

```js
var res = pm.response.json();
pm.collectionVariables.set('token', res.token);
```
