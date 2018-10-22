import { doGet, doPost } from './server/webapp';
import './es6';
import './polyfill'

global.doGet = doGet;
global.doPost = doPost;