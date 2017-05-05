Plotly.plot('graph', [{
  x: [1, 2, 3],
  y: [2, 4, 3],
  line: {simplify: false}
}]).then(function () {
  Plotly.animate('graph', [{
    data: [{
      y: [3, 4, 2]
    }]
  }]);
});
