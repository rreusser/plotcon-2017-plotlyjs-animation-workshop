Plotly.plot('graph', [{
  x: [1, 2, 3],
  y: [0, 1, 0.5],
}]);

document.getElementById('play')
    .addEventListener('click', function () {
  Plotly.animate('graph', [{
    data: [{
      y: [
        Math.random(),
        Math.random(),
        Math.random()
      ]
    }]
  }]);
});
