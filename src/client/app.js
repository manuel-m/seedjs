import 'babel-polyfill';
import Request from '../shared/request';

const req1 = new Request('request 1');

document.querySelector('.app').innerText = req1.version();
