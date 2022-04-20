# Include Into Your Project

Install mailjs:

```sh
npm install @cemalgnlts/mailjs
```

or

```sh
yarn add @cemalgnlts/mailjs
```

Import the package:

```js
// import Mailjs from "@cemalgnlts/mailjs";
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
