const Router = require('../es6/Router.js');
const express = require("express")
const url = require("url")
const app = express()
const port = 8000

app.use(express.json())

app.all("*", (request, response) => {
  const parts = url.parse(request.url, true)
  const router = new Router({
    path: parts.pathname,
    method: request.method,
    params: parts.query,
    body: request.body
  }, request.method)
  
  response.setHeader("Content-Type", "application/json")
  response.send(JSON.stringify(router.route()))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const doGet = (e) => {
  const out = JSON.stringify(router.route(), (key, value) => {
    if (value !== null) return value // Filters null values
  })
  return ContentService.createTextOutput(
    e.params.callback + "(" + out + ")", ContentService.MimeType.JAVASCRIPT);
};

 const doPost = (e) => {
  let router = new Router(e, "POST")
  //let router = new Router(e, "POST")
  const out = JSON.stringify(router.route())
  return ContentService.createTextOutput(e.params.callback + "(" + out + ")"
    , ContentService.MimeType.JAVASCRIPT)
}
