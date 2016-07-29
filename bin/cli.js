#!/usr/bin/env node

var start, end;
console.log('bundling js...');
start = (new Date).getTime();
require('../lib/bundle_js.js');
end = (new Date).getTime();
console.log('complete js bundling in ' + (end - start) / 1000 + ' seconds');