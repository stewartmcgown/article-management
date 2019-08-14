<p align="center">
<img src="https://assets.ysjournal.com/img/logo-production.png" width=150 />
</p>
<h1 align="center">Article Management System</h1>
<p align="center">
<img src="https://david-dm.org/youngscientists/article-management.svg" />
<img src="https://travis-ci.org/youngscientists/article-management.svg?branch=typescript" />
</p>

A turnkey solution for article submission, peer review and publishing.

# Features
- A [REST API](#api) using routing-controllers
- Database-agnosticism using [TypeORM](https://github.com/typeorm/typeorm)
- Collaborative document editing with [Google Docs](https://docs.google.com)
- [Publishing](#publishing) of completed articles to a CMS
- Plagiarism checking
- Copyright detection

## API
AMS provides a RESTful API that gives powerful tools to editors who want to manage a collection of scientific articles, using a token-based authorisation system. The system also exposes an endpoint for the submission of articles.

## Publishing
Articles can be published to a CMS using one of the supported publishing plugins. Currently only **Wordpress** is supported.

> Built with :heart: for the [Young Scientists Journal](https://ysjournal.com).

> Original design by [Stewart McGown](https://twistedcore.co.uk) and [Peter He](https://github.com/peterthehe)