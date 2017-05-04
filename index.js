var iframe = require('iframe');

function Pen (root, slideNumber) {
  var ta = root.querySelector('textarea');

  var cm = CodeMirror.fromTextArea(ta, {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'neo'
  });

  cm.display.wrapper.addEventListener('keyup', function (e) {
    e.stopPropagation();
  });

  var outputDiv = document.createElement('div');
  outputDiv.classList.add('pen-output');
  root.appendChild(outputDiv);

  var frame = iframe({
    container: outputDiv,
  });

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
      title: 'Plotly.js Master Class - Slide #' + slideNumber,
      html: '<div id="graph"/>',
      js: cm.getValue()
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
        <div id="graph"/>
        <script type="text/javascript">${cm.getValue()}</script>
      `
    });
  };

  this.refresh();

  this.destroy = function () {
    cm.toTextArea();
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
  prevBtn.textContent = '←';
  nextBtn.textContent = '→';
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
