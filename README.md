# Mailjs

A JavaScript wrapper around the [mail.tm](https://docs.mail.tm/) api.


If the request is sent correctly, `status` returns true. If it returns incorrect, the `status` will be false and the `message` in the data is also added.

A successfull response example:

```json
{
  "status": false,
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


# Domain

## List Domains

```js
mailjs.getDomains()
  .then(console.log)
```

## Get Domain

```js
mailjs.getDomain("[domain id]")
  .then(console.log)
```

---

# Account

## Create Account

```js
mailjs.register("user@example.com", "password")
  .then(console.log)
```

## Login

`mailjs.token` and `mailjs.id` can be used to access the user token and id later.

```js
mailjs.login("user@example.com", "password")
  .then(console.log)
```

## Get Account Data

```js
mailjs.me()
  .then(console.log)
```

## Delete Account

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

```js
mailjs.listMessages()
  .then(console.log)
```


### Read a message

```js
mailjs.getMessage("[message id]")
  .then(console.log)
```

### Delete a message

```js
mailjs.deleteMessage("[message id]")
  .then(console.log)
```

### Mark as readed a message

```js
mailjs.makeSeenTrue("[message id]")
  .then(console.log)
```

# Source

## Get source

```js
mailjs.getSource("[message id]")
  .then(console.log)
```
