import { Router } from '../es6/Router.js';
import AMS from '../es6/AMS.js';

export const doGet = (e) => {
  let router = new Router(e, "GET")
  return ContentService.createTextOutput(
    JSON.stringify(router.route(), (key, value) => {
      if (value !== null) return value // Filters null values
    }));
};

export const doPost = (e) => {
  let router = new Router(e, "POST")
  //let router = new Router(e, "POST")
  return ContentService.createTextOutput(JSON.stringify(router.route()))
}
