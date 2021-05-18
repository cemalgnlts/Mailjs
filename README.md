# Mailjs

A JavaScript wrapper around the [mail.tm](https://docs.mail.tm/) api.


If the request is sent correctly, `status` returns true. If it returns incorrect, the `status` will be false and the `message` in the data is also added.

# Create Account

```js
mailjs.register("username@domain.com", "password")
  .then(console.log)
```

## Success result

```json
{
  "status": true,
  "data": {
    "address": "user@example.com",
    "quota": 0,
    "used": 0,
    "isDisabled": true,
    "isDeleted": true,
    "createdAt": "2021-05-18T20:19:49.630Z",
    "updatedAt": "2021-05-18T20:19:49.630Z"
  }
}
```
