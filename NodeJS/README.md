# Include Into Your Project

install mailjs:

```bash
npm install @cemalgnlts/mailjs
```

Import the package.

```js
const Mailjs = require("@cemalgnlts/mailjs");

const mailjs = new Mailjs();
```

# Demo

```js
const Mailjs = require("@cemalgnlts/mailjs");

const mailjs = new Mailjs();

mailjs.getDomains()
  .then(res => {
    // console.log(res)
    console.log("Domain name:", res.data[0].domain);
  });
```
