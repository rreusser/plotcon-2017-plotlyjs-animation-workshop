Plotly.plot('graph', {
  data: [{
    x: [1, 2, 3],
    y: [1, 2, 3],
    line: {color: 'red'}
  }],
  layout: {
    sliders: [{
      steps: [{
        label: 'Red',
        method: 'restyle',
        args: ['line.color', 'red']
      }, {
        label: 'Green',
        method: 'restyle',
        args: ['line.color', 'green']
      }]
    }]
  }
});
