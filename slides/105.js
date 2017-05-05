Plotly.plot('graph', {
  data: [{
    x: [1, 2, 3],
    y: [2, 1, 3],
    line: {color: 'red', simplify: false}
  }],
  frames: [{
    name: 'red',
    data: [{
      y: [2, 1, 3],
     'line.color': 'red'
     }]
  }, {
    name: 'green',
    data: [{
      y: [3, 2, 1],
      'line.color': 'green'
    }]
  }, {
    name: 'blue',
    data: [{
      y: [1, 3, 2],
      'line.color': 'blue'
    }]
  }],
  layout: {
    sliders: [{
      steps: [{
        label: 'red',
        method: 'animate',
        args: [['red']]
      }, {
        label: 'green',
        method: 'animate',
        args: [['green']]
      }, {
        label: 'blue',
        method: 'animate',
        args: [['blue']]
      }]
    }],
    updatemenus: [{
      type: 'buttons',
      xanchor: 'right',
      yanchor: 'top',
      buttons: [{
        label: 'Play',
        method: 'animate',
        args: [null]
      }]
    }]
  },
});
