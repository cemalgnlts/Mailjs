# Mailjs

A JavaScript wrapper around the [mail.tm](https://docs.mail.tm/) api.

Probably one of the best API for creating temporary email accounts.

* Usage of our API for illegal activity is strictly prohibited.
* It is forbidden to sell programs or earn from it that exclusively uses our API (for example, creating a competing temp mail client and charging for it's usage).
* The general quota limit is 8 queries per second (QPS) per IP address.

# Installation

**npm**
```sh
npm install @cemalgnlts/mailjs
```

**yarn**
```sh
yarn add @cemalgnlts/mailjs
```

**CDN**
```
<script src="https://cdn.jsdelivr.net/gh/cemalgnlts/Mailjs@latest/mailjs.min.js"></script>
```

# Documentation

Returns a Promise object after the function is called. If the request is sent correctly, `status` returns true. If it returns incorrect, the `status` will be false and the `message` in the data is also added.

A successfull response example:

```json
{
  "status": true,
  "message": "ok",
  "data": ...
}
```

A failed response example:

```json
{
  "status": false,
  "message": "Invalid credentials.",
  "data": ...
}
```

To see all results, check out the API page: [https://api.mail.tm/](https://api.mail.tm/)

User needs to login to access JWT token. Registration does not return this information, log in after registration.


After the login process, the user's JWT token and ID are assigned to `mailjs.token` and `mailjs.id`

---

## Domain

### List Domains
```js
mailjs.getDomains()
  .then(console.log)
```

### Get Domain
```js
mailjs.getDomain("[domain id]")
  .then(console.log)
```

---

## Account

### Create Account
```js
mailjs.register("user@example.com", "password")
  .then(console.log)
```

### Login

`mailjs.token` and `mailjs.id` can be used to access the user token and id later.

```js
mailjs.login("user@example.com", "password")
  .then(console.log)
```

### Get Account Data
```js
mailjs.me()
  .then(console.log)
```

### Delete Account
```js
mailjs.deleteMe()
  .then(console.log)
```

You can also use the id to access the user's information and delete their account.

```js
mailjs.deleteAccount("[account id]")
  .then(console.log)
```

```js
mailjs.getAccount("[account id]")
  .then(console.log)
```

---

## Message

### List messages
Gets all the Message resources of a given page.

```js
mailjs.getMessages()
  .then(console.log)
```


### Read a message
Retrieves a Message resource with a specific id (It has way more information than a message retrieved with GET /messages but it hasn't the "intro" member)

```js
mailjs.getMessage("[message id]")
  .then(console.log)
```

### Delete a message
```js
mailjs.deleteMessage("[message id]")
  .then(console.log)
```

### Make a message readed or unreaded.
`true` for make readed. `false` for make unreaded.

```js
mailjs.setMessageSeen("[message id]", true)
  .then(console.log)
```

## Source

### Get source
Gets a Message's Source resource (If you don't know what this is, you either don't really want to use it or you should [read this!](https://en.wikipedia.org/wiki/Email#Plain_text_and_HTML))

```js
mailjs.getSource("[message id]")
  .then(console.log)
```

## Helper Methods

### Create random account.

Creates and logs in an account with a random username and password.

```js
mailjs.createOneAccount()
  .then(console.log);
```

#### Response

```json
{
  "status": true,
  "data": {
    "username": "user@example.com",
    "password": "my-password"
  }
}
```

# Questions And Suggestions
If you have any questions or suggestions, please contact us via email [support@mail.tm](mailto:support@mail.tm) or [discord](https://discord.gg/mail).
