let menu = Menu.buildFromTemplate([{
  label: 'Debug',
  submenu: [{
      label: 'Open Debug Menu',
      click() {
        modal.style.display = 'block'
      }
    },

    {
      label: 'Close Debug Menu',
      click() {
        modal.style.display = 'none'
      }
    }
  ]
},
{
  label: 'Graphs',
  submenu: [{
      label: 'Graph RPM',
      click() {}
    },
    {
      label: 'Graph SOC',
      click() {}
    }
  ]
},
{
  label: 'Gauges',
  submenu: [{
      label: 'RPM Gauge',
      submenu: [{
          label: 'show',
          click() {
            rpm.style.display = 'block'
            rpmGauge.style.display = 'block'
          }
        },
        {
          label: 'hide',
          click() {
            rpm.style.display = 'none'
            rpmGauge.style.display = 'none'
          }
        }
      ]
    },
    {
      label: 'SOC Gauge',
      submenu: [{
          label: 'show',
          click() {
            document.getElementById('soc').style.display = 'block'
            document.getElementById('socBG').style.display = 'block'
          }
        },
        {
          label: 'hide',
          click() {
            document.getElementById('soc').style.display = 'none'
            document.getElementById('socBG').style.display = 'none'
          }
        }
      ]
    },
    {
      label: 'Temp Gauge',
      submenu: [{
          label: 'show',
          click() {
            document.getElementById('temps').style.display = 'block'
          }
        },
        {
          label: 'hide',
          click() {
            document.getElementById('temps').style.display = 'none'
          }
        }
      ]
    }
  ],
}
])

Menu.setApplicationMenu(menu);