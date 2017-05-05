Plotly.plot('graph', {
  data: [{
    x: [1, 2, 3],
    y: [1, 2, 3],
    line: {color: 'red'}
  }],
  frames: [{
    name: 'frame1',
    data: [{'line.color': 'red'}]
  }, {
    name: 'frame2',
    data: [{'line.color': 'green'}]
  }],
  layout: {
    sliders: [{
      steps: [{
        label: 'Red',
        method: 'animate',
        args: [['frame1']]
      }, {
        label: 'Green',
        method: 'animate',
        args: [['frame2']]
      }]
    }]
  }
});
