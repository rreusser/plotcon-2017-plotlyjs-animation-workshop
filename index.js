var Sandbox = require('browser-module-sandbox');
var camelcase = require('camelcase');

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
    mode: 'xml',
    htmlMode: true,
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

  var jsBtn = root.querySelector('.pen-editJs');
  var htmlBtn = root.querySelector('.pen-editHtml');

  this.editJs = function () {
    jsContainer.style.opacity = 1;
    htmlContainer.style.opacity = 0;
    jsContainer.style.pointerEvents = 'all';
    htmlContainer.style.pointerEvents = 'none';

    jsBtn.classList.add('is-active');
    htmlBtn.classList.remove('is-active');
  };

  this.editHtml = function () {
    jsContainer.style.opacity = 0;
    htmlContainer.style.opacity = 1;
    jsContainer.style.pointerEvents = 'none';
    htmlContainer.style.pointerEvents = 'all';

    jsBtn.classList.remove('is-active');
    htmlBtn.classList.add('is-active');
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
      html: `<head>
<script src="https://s3.amazonaws.com/assets.rickyreusser.com/fakerequire.js"></script>
${(requires && requires.length > 0) ? requires.map(m => '<script src="' + 'https://wzrd.in/standalone/' + m + '"></script>\n') : ''}
</head>
<body>
${htmlEditor.getValue()}
</body>
`,
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

  var modules, requires;
  var sandbox = Sandbox({
    container: outputDiv,
    cdn: 'http://wzrd.in',
    iframeBody: htmlEditor.getValue(),
    iframeHead: '<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>',
  });

  sandbox.on('modules', function (m) {
    requires = m.slice().map(function (mod) { return mod.name });
    modules = m.slice().map(function (mod) {
      return camelcase(mod.name)
    });
  });


  this.refresh = function () {
    sandbox.iframeBody = htmlEditor.getValue();
    sandbox.bundle(jsEditor.getValue());
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
