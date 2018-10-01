
![AMS Logo](https://assets.ysjournal.com/img/article-management.png)

A system for managing articles submitted by the many contributing authors of the Young Scientist Journal.

## API
AMS is a RESTful API that gives powerful tools to editors who want to manage a collection of scientific articles, using a token-based authorisation system.

### Routes

List of possible API paths

**GET**
- articles
    - list
- article
    - info
- authentication 
    - authenticate

**POST**
- article
    - create
    - update


## Technical

 - API built on Google Apps Script
 - Modularity allows for switching to alternative platform
 - Written in ES6+, transpiles to ES5.
 - Interfaces with a Spreadsheet
 - Data comes from the [article-submissions](https://github.com/youngscientists/article-submissions) form.

> Built with :heart: for the [Young Scientists Journal](https://ysjournal.com).

> Platform design by [Stewart McGown](https://twistedcore.co.uk) and [Peter He]()