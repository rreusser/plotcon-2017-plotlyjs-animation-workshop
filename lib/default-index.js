var toStream = require('string-to-stream');
var fs = require('fs');
var path = require('path');
var hyperstream = require('hyperstream');
var MarkdownIt = require('markdown-it');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var md = new MarkdownIt({
  html: true
});
var brfs = require('brfs');

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
      content = `
        <div class="pen">
          <textarea>${entities.encode(content.toString())}</textarea>
          <div class="pen-controls">
            <button class="pen-refresh">Refresh</button>
            <button class="pen-codepen">Edit on CodePen</button>
          </div>
        </div>
      `;
      slideClass = 'slide--code';
    }

    return idx.pipe(hyperstream({
      '#slideshow': {_appendHtml: `<section class="slide ${slideClass}">${content}</section>\n`}
    }));
  }, index);
}
