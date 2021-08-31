# School Management System

> An node js project based on Ts.ED framework

See [Ts.ED](https://tsed.io) project for more information.

## Build setup

> **Important!** Ts.ED requires Node >= 10, Express >= 4 and TypeScript >= 3.

```batch
# install dependencies
$ yarn install

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```

## Steps to automate API testing

### Add following to collection

siteUrl and token variable

### Use Auth -> Login and update token

```js
var res = pm.response.json();
pm.collectionVariables.set('token', res.token);
```

