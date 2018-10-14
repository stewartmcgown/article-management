import { Router } from '../es6/Router.js';

export const doGet = (e) => {
  let router = new Router(e, "GET")
  return ContentService.createTextOutput(
    JSON.stringify(router.route(), (key, value) => {
      if (value !== null) return value // Filters null values
    }));
};
