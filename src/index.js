/* eslint-disable no-console */

import App from './app';
import hello from './utils/hello';

const app1 = new App('app1');
const app2 = new App('app2');


hello('balala');

console.log(app1.version());
console.log(app2.version());
