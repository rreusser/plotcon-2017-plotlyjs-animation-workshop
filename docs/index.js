(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var iframe = require('iframe');

function Pen (root, slideNumber) {
  var jsTextarea = root.querySelector('.pen-js');
  var htmlTextarea = root.querySelector('.pen-html');

  var jsEditor = CodeMirror.fromTextArea(jsTextarea, {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'neo'
  });

  var htmlEditor = CodeMirror.fromTextArea(htmlTextarea, {
    lineNumbers: true,
    mode: 'html',
    theme: 'neo'
  });

  var jsContainer = root.querySelector('.pen-jsContainer');
  var htmlContainer = root.querySelector('.pen-htmlContainer');

  jsEditor.display.wrapper.addEventListener('keyup', function (e) {
    e.stopPropagation();
  });

  htmlEditor.display.wrapper.addEventListener('keyup', function (e) {
    e.stopPropagation();
  });

  var outputDiv = document.createElement('div');
  outputDiv.classList.add('pen-output');
  root.appendChild(outputDiv);

  var frame = iframe({container: outputDiv});

  this.editJs = function () {
    jsContainer.style.opacity = 1;
    htmlContainer.style.opacity = 0;
    jsContainer.style.pointerEvents = 'all';
    htmlContainer.style.pointerEvents = 'none';
  };

  this.editHtml = function () {
    jsContainer.style.opacity = 0;
    htmlContainer.style.opacity = 1;
    jsContainer.style.pointerEvents = 'none';
    htmlContainer.style.pointerEvents = 'all';
  };

  this.codepen = function () {
    var form = document.createElement('form');
    form.action = "http://codepen.io/pen/define";
    form.method = "POST";
    form.target = "_blank";

    var data = document.createElement('input');
    data.name = "data";
    data.type = 'hidden';
    data.setAttribute('value', JSON.stringify({
      js_external: "https://cdn.plot.ly/plotly-latest.min.js",
      editors: "001",
      title: 'Plotly.js Master Class - Slide #' + slideNumber,
      description: 'Plotly.js Master Class - Slide #' + slideNumber,
      html: htmlEditor.getValue(),
      js: jsEditor.getValue()
    }));

    var submit = document.createElement('button');
    submit.type = "submit";

    document.body.appendChild(form);

    form.appendChild(data);
    form.appendChild(submit);
    form.style.display = 'none';

    form.submit();

    document.body.removeChild(form);
  };

  this.refresh = function () {
    frame.setHTML({
      head: '<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>',
      body: `
        ${htmlEditor.getValue()}
        <script type="text/javascript">${jsEditor.getValue()}</script>
      `
    });
  };

  this.refresh();
  this.editJs();

  this.destroy = function () {
    jsEditor.toTextArea();
    root.removeChild(outputDiv);
  }
}

function Indicator (root, prev, next) {
  var ind = document.createElement('div');
  ind.classList.add('indicator');
  var output = document.createElement('span');
  var nextBtn = document.createElement('button');
  var prevBtn = document.createElement('button');
  prevBtn.classList.add('indicator-btn');
  nextBtn.classList.add('indicator-btn');
  prevBtn.classList.add('indicator-btn--prev');
  nextBtn.classList.add('indicator-btn--next');
  prevBtn.innerHTML = '&larr;';
  nextBtn.innerHTML = '&rarr;';
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  ind.appendChild(prevBtn);
  ind.appendChild(output);
  ind.appendChild(nextBtn);

  root.appendChild(ind);

  this.update = function (msg) {
    output.textContent = msg;
  }
}

var slideshow = window.slideshow = {
  active: 0,
  initialize: function () {
    this.slideshowEl = document.getElementById('slideshow');
    this.slides = this.slideshowEl.querySelectorAll('.slide');
    this.slideshowEl.classList.add('slideshow');

    this.indicator = new Indicator(this.slideshowEl, this.prev.bind(this), this.next.bind(this));

    var initialSlide = window.location.hash.replace(/^#/,'')
    this.setSlide(initialSlide.length > 0 ? (parseInt(initialSlide) - 1) : 0);

    document.addEventListener('click', function (ev) {
      if (ev.target && ev.target.classList.contains('pen-refresh')) {
        this.pen && this.pen.refresh();
      }
      if (ev.target && ev.target.classList.contains('pen-codepen')) {
        this.pen && this.pen.codepen();
      }
      if (ev.target && ev.target.classList.contains('pen-editHtml')) {
        this.pen && this.pen.editHtml();
      }
      if (ev.target && ev.target.classList.contains('pen-editJs')) {
        this.pen && this.pen.editJs();
      }
    }.bind(this));

    document.addEventListener('keyup', function (ev) {
      switch(ev.keyCode) {
        case 37:
          this.prev();
          break;
        case 39:
          this.next();
          break;
      }
    }.bind(this));
  },
  setSlide: function (i) {
    this.active = i;

    document.body.setAttribute('data-slide-number', i);

    window.location.hash = '' + (i + 1);
    var prevActive = this.activeSlide;

    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];
      if (i === this.active) {
        slide.classList.add('js-active');
        this.activeSlide = slide;
      } else {
        slide.classList.remove('js-active');
      }
    }

    if (this.activeSlide !== prevActive) {
      if (this.pen) {
        this.pen.destroy();
        this.pen = null;
      }
      if (this.activeSlide.classList.contains('slide--code')) {
        this.pen = new Pen(this.activeSlide, this.active)
      }
    }

    this.indicator.update((this.active + 1) + ' / ' + this.slides.length);
  },
  next: function () {
    this.setSlide((this.active + 1) % this.slides.length);
  },
  prev: function () {
    this.setSlide((this.active - 1 + this.slides.length) % this.slides.length);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  slideshow.initialize();
});

},{"iframe":2}],2:[function(require,module,exports){
module.exports = function(opts) {
  return new IFrame(opts)
}

function IFrame(opts) {
  if (!opts) opts = {}
  this.opts = opts
  this.container = opts.container || document.body
  this.setHTML(opts)
}

IFrame.prototype.parseHTMLOptions = function(opts) {
  if (typeof opts === 'string') opts = {html: opts}
  if (!opts) opts = {}
  if (opts.body || opts.head) {
    if (!opts.body) opts.body = ""
    if (!opts.head) opts.head = ""
    opts.html = '<!DOCTYPE html><html><head>' + opts.head + '</head><body>' + opts.body + '</body></html>'
  }
  if (!opts.sandboxAttributes) opts.sandboxAttributes = ['allow-scripts']
  return opts
}

IFrame.prototype.remove = function() {
  if (this.iframe) this.container.removeChild(this.iframe)
}

IFrame.prototype.setHTML = function(opts) {
  opts = this.parseHTMLOptions(opts)
  if (!opts.html && !opts.src) return
  this.remove()
  
  // if src is passed in use that (this mode ignores body/head/html options)
  if (opts.src) {
    var targetUrl = opts.src
  } else {
    // create a blob for opts.html and set as iframe `src` attribute
    var blob = new Blob([opts.html], { encoding: 'UTF-8', type: 'text/html' })
    var U = typeof URL !== 'undefined' ? URL : webkitURL
    var targetUrl = U.createObjectURL(blob)    
  }
  // create temporary iframe for generating HTML string
  // element is inserted into the DOM as a string so that the security policies do not interfere
  // see: https://gist.github.com/kumavis/8202447
  var tempIframe = document.createElement('iframe')
  tempIframe.src = targetUrl
  tempIframe.setAttribute('scrolling', this.opts.scrollingDisabled ? 'no' : 'yes')
  tempIframe.style.width = '100%'
  tempIframe.style.height = '100%'
  tempIframe.style.border = '0'
  tempIframe.sandbox = opts.sandboxAttributes.join(' ')
  if (opts.name) tempIframe.setAttribute('name', opts.name)
  // generate HTML string
  var htmlSrc = tempIframe.outerHTML
  // insert HTML into container
  this.container.insertAdjacentHTML('beforeend', htmlSrc)
  // retrieve created iframe from DOM
  var neighborIframes = this.container.querySelectorAll('iframe')
  this.iframe = neighborIframes[neighborIframes.length-1]
}

},{}]},{},[1]);
