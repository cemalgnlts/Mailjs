# Include Into Your Project

Download `Mailjs.js` class.

install mailjs:

```bash
npm install @cemalgnlts/mailjs
```

Add it to the class you want to use.

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
