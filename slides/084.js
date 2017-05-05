var shuffle = require('shuffle-array');

var ids = ['1', '2', '3', '4', '5', '6'];

Plotly.plot('graph', [{
  x: [1, 0.5, -0.5, -1, -0.5, 0.5],
  y: [0, 0.866, 0.866, 0, -0.866, -0.866],
  ids: ids,
  text: ids,
  textposition: 'middle right',
  mode: 'markers+text'
}]);

var btn = document.getElementById('shuffle');

btn.addEventListener('click', function () {
  shuffle(ids);
  Plotly.animate('graph', [{
    data: [{ids: ids}]
  }]);
});
