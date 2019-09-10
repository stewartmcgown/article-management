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

You must include an array of files that correspond to the upload of the article. The ordering is important, as the _first file_ must be the article, with all subsequent files being author pictures.

If you had, for example, an article with two authors, this would be the `multipart/form-data` body.

```json5
Content-Type: multipart/form-data; boundary=------------------9051914041544843365972754266
Content-Length: 3340
-------------------9051914041544843365972754266
Content-Disposition: form-data; name="files[]"; filename="MyArticle.docx"
Content-Type: text/plain

Binary data of MyArticle.docx

-------------------9051914041544843365972754266
Content-Disposition: form-data; name="files[]"; filename="Author1.jpeg"
Content-Type: image/jpeg

Binary data of Author1.jpeg

-------------------9051914041544843365972754266
Content-Disposition: form-data; name="files[]"; filename="Author2.jpeg"
Content-Type: image/jpeg

Binary data of Author2.jpeg

-------------------9051914041544843365972754266
Content-Disposition: form-data; name="article"
Content-Type: application/json

{
    "title": ...,
    ...
}

-------------------9051914041544843365972754266--
```

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
