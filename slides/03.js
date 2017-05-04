Plotly.plot('graph', [{
  x: [1, 2, 3],
  y: [2, 3, 4],
  line: {simplify: false}
}]);

document.getElementById('play').addEventListener('click', function () {
  Plotly.animate('graph', [{
    data: [{
      y: [3, 4, 2]
    }],
    traces: [0]
  }]);
})
