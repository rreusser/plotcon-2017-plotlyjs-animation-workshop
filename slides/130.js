var norm = require('random-normal');
var iota = require('iota-array');

Plotly.plot('graph', [{
  x: iota(100).map(norm),
  y: iota(100).map(norm),
  mode: 'markers',
}]);

