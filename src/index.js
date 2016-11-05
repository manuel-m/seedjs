/* eslint-disable no-console */

import App from './app';
import hello from './utils/hello';

const app1 = new App('app1');


hello('ESLint + TypeScript');

console.log(app1.version());

