/* eslint-disable no-console */

import Request from '../shared/request';
import hello from '../shared/hello';

const req1 = new Request('req1');


hello('ESLint + TypeScript');

console.log(req1.version());

