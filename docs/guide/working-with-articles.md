# Working with Articles

## Creating Articles

Articles are created using a `multipart/form-data` approach. You can supply the metadata along with the raw file. This endpoint is public, so only a subset of options are writable for anonymous users.

### `POST /articles`

#### Article Metadata

```js
{
    "title": String,
    "subject": Subject,
	"type": Type,
	"summary": String,
	"reason": String,
	"authors":[{
		"email": String,
		"name": String,
		"school": String,
		"biography": String,
        "country": String
	}]
}
```

#### Multipart/form-data

```
Content-Type: multipart/form-data; boundary=------------------9051914041544843365972754266
Content-Length: 554
-------------------9051914041544843365972754266
Content-Disposition: form-data; name="file"; filename="MyArticle.docx"
Content-Type: text/plain

Binary data of MyArticle.docx

-------------------9051914041544843365972754266
Content-Disposition: form-data; name="articles"

{
    "title": ...,
    ...
}

-------------------9051914041544843365972754266--
```

You can simplify this using a generator for multipart requests.

## Managing Articles

### `GET /articles`

Fetches all the currently available articles.

_Request_

```json5
GET / articles
```

_Response_

```json
[Article]
```

## Searching for Articles

You can search for articles by using the custom query parameter. Concatenate whichever properties you want to search for from the Article resource in the following format:

```json5
GET / articles ? (q = { prop }) : { value }
```

Values with spaces are absolutely okay. The following example will return only untrashed articles with a title containing Lorem Ipsum.

```json5
GET /articles?q=trashed:false title:Lorem Ipsum
```
