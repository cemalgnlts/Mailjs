# Include Into Your Project

Download `Mailjs.js` class.

install node-fetch:

```sh
npm install node-fetch
```

Add it to the class you want to use.

```js
const Mailjs = require("./Mailjs")

const mailjs = new Mailjs()
```

# Demo

```
const Mailjs = require("./Mailjs")

const mailjs = new Mailjs()

mailjs.getDomains()
  .then(res => {
    // console.log(res)
    console.log("Domain name:", res.data[0].domain)
  })
```
