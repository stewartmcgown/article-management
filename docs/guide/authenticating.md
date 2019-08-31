# Authenticating

## Getting Tokens

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

## User levels

Users can be one of the following levels:

## Authorizing Future Requests

Attach the token to an Authorization header.

```
Authorization: Bearer ey...xxxx
```

## Refresh Tokens

There is currently _no support_ for refresh tokens. Users must re-authenticate every time they wish to log in. In the future, you will be able to allow users to keep logged in. We recommend against this for data security purposes.
