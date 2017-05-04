Plotly.plot('graph', [{
  x: [1, 2, 3],
  y: [2, 4, 3],
  line: {simplify: false}
}]).then(function () {
  return Plotly.animate('graph', [{
    data: [{
      y: [3, 4, 2]
    }]
  }, {
    data: [{
      y: [4, 2, 3]
    }]
  }]);
});
