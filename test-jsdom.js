const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const DOMParser = dom.window.DOMParser;
const parser = new DOMParser();

const xml = fs.readFileSync('ie.xml', 'utf8');
const doc = parser.parseFromString(xml, 'text/xml');
const parseError = doc.querySelector('parsererror');
if (parseError) {
  console.log("Parse Error found!", parseError.textContent.substring(0, 100));
} else {
  const items = doc.querySelectorAll('item');
  console.log('Items found:', items.length);
}
