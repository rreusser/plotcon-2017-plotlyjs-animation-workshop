var frame1 = {
  name: 'frame1',
  data: [{
    y: [4, 2, 3]
  }],
};

var frame2 = {
  name: 'frame2',
  data: [{
    y: [3, 2, 4]
  }],
};

Plotly.plot('graph', {
  data: [{
    x: [1, 2, 3],
    y: [2, 4, 3],
  }],
  frames: [frame1, frame2]
}).then(function () {
  return Plotly.animate('graph', ['frame1', 'frame2']);
});
