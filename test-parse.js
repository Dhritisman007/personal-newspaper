const fs = require('fs');
const { DOMParser } = require('@xmldom/xmldom');

const xml = fs.readFileSync('ie.xml', 'utf8');
const doc = new DOMParser().parseFromString(xml, 'text/xml');
const items = doc.getElementsByTagName('item');
console.log('Items found:', items.length);
