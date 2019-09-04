# Getting Started

## Development Environment

* Fist Check
  *  Make sure that you are on the `typescript` branch.
  *  Make sure to rename the `.env.example` to `.env`.
  *  Make sure that you don't have postgres running, it might interfere with docker and give you an error.
* Then Run
  * run `docker-compose up -d` # Creates a Postgres database
  * run `npm run setup`
  * run `npm run serve`
