function iotaArray(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = i
  }
  return result
}

var ntraces = 10;
var traces = [];
var npts = 200;
for (j = 0; j < ntraces; j++) {
  var x = [0];
  var y = [0];
  for (var i = 1; i < npts; i++) {
    x[i] = x[i - 1] + Math.random() - 0.5
    y[i] = y[i - 1] + Math.random() - 0.5
  }
  traces.push({
    x: x,
    y: y,
    showlegend: false,
    opacity: 0.5,
    line: {simplify: false},
    mode: 'lines',
    transforms: [{
      type: 'filter',
      target: iotaArray(npts),
      operation: '<',
      value: 1
    }]
  })
}

var wh = Math.min(window.innerWidth - 20, window.innerHeight - 20);
Plotly.plot('graph', traces, {
  xaxis: {
    scaleratio: 1,
    scaleanchor: 'y',
    range: [-6, 6]
  },
  yaxis: {
    range: [-6, 6]
  },
  width: wh,
  height: wh,
  sliders: [{
    steps: iotaArray(npts).map((i) => ({
      label: i,
      method: 'animate',
      args: [[{
        data: iotaArray(ntraces).map(() => ({
          'transforms[0].value': i
        })),
        traces: iotaArray(ntraces)
      }], {
        transition: {duration: 0},
        frame: {duration: 0, redraw: false},
        mode: 'immediate'
      }]
    }))
  }]
}, {
  scrollZoom: true
});

