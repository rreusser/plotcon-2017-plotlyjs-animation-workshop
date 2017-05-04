var toStream = require('string-to-stream');
var fs = require('fs');
var path = require('path');
var hyperstream = require('hyperstream');
var MarkdownIt = require('markdown-it');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var md = new MarkdownIt({ html: true
});
var brfs = require('brfs');
var ghCorner = require('html-inject-github-corner');

module.exports = function () {
  var index = fs.createReadStream(path.join(__dirname, '../index.html'));
  var slides = fs.readdirSync(path.join(__dirname, '../slides')).sort();

  return slides.reduce(function (idx, next) {
    var slideClass = '';
    var content = fs.readFileSync(path.join(__dirname, '../slides', next));

    if (/\.md$/.test(next)) {
      content = md.render(content.toString());
      slideClass = 'slide--markdown';
    }

    if (/\.js$/.test(next)) {

      var defaultHTML = `<div id="graph"></div>`;

      content = `
        <div class="pen">
          <div class="pen-jsContainer">
            <textarea class="pen-js">${entities.encode(content.toString())}</textarea>
          </div>
          <div class="pen-htmlContainer">
            <textarea class="pen-html">${entities.encode(defaultHTML.toString())}</textarea>
          </div>
          <div class="pen-controls pen-controls--actions">
            <button class="pen-refresh">Refresh</button>
            <button class="pen-codepen">Edit on CodePen</button>
          </div>
          <div class="pen-controls pen-controls--tabs">
            <button class="pen-editJs">JS</button>
            <button class="pen-editHtml">HTML</button>
          </div>
        </div>
      `;
      slideClass = 'slide--code';
    }

    return idx.pipe(hyperstream({
      '#slideshow': {_appendHtml: `<section class="slide ${slideClass}">${content}</section>\n`}
    }));
  }, index).pipe(ghCorner());
}
