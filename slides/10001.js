var norm = require('random-normal');

Plotly.plot('graph', [{
  x: new Array(100).fill(0).map(norm),
  y: new Array(100).fill(0).map(norm),
  mode: 'markers',
}]);
