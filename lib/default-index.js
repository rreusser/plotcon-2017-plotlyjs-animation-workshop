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

  var types = {}
  var slideNames = [];

  slides.forEach(function (n) {
    var match = n.match(/(.*)\.(.*)/);
    var type = types[match[1]] = types[match[1]] || {};
    type[match[2]] = true;
    if (slideNames.indexOf(match[1]) === -1) {
      slideNames.push(match[1]);
    }
  })

  return slideNames.reduce(function (idx, name) {
    var slideClass = '';

    var html = '';
    var js = '';

    if (types[name].md) {
      var htmlContent = fs.readFileSync(path.join(__dirname, '../slides', name + '.md'));
      html = md.render(htmlContent.toString());
      slideClass = 'slide--markdown';
    }

    if (types[name].html) {
      var html = fs.readFileSync(path.join(__dirname, '../slides', name + '.html')).toString();
      slideClass = 'slide--html';
    }

    if (types[name].js) {
      if (!types[name].html) {
        html = `<div id="graph"></div>`;
      }

      var jsContent = fs.readFileSync(path.join(__dirname, '../slides', name + '.js'));

      html = `
        <div class="pen">
          <div class="pen-jsContainer">
            <textarea class="pen-js">${entities.encode(jsContent.toString())}</textarea>
          </div>
          <div class="pen-htmlContainer">
            <textarea class="pen-html">${entities.encode(html)}</textarea>
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
      '#slideshow': {_appendHtml: `<section class="slide ${slideClass}">${html}</section>\n`}
    }));
  }, index).pipe(ghCorner());
}
