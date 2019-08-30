# Authenticating

You can authenticate with the API by making a POST request to the pin endpoint.

### `POST /auth/pin`

```json5
{
    email: "you@example.com"
}
```

### `POST /auth/token`

Using the token emailed to you, log in.

#### Request

```json
{
    "email": "you@example.com",
    "pin": "123456"
}
```

#### Response

```json
{
    "token": "ey...xxxx"
}
```

## Authorizing Future Requests

Attach the token to an Authorization header

```
Authorization: Bearer ey...xxxx
```
