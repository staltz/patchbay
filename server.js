const Client = require('ssb-client')
const scuttleshell = require('scuttle-shell')
const electron = require('electron')

// Get config options from depject
const config = require('./config').create().config.sync.load()
const startFrontend = () => electron.ipcRenderer.send('server-started')

Client(config.keys, config, (err, server) => {
  if (err) { // no server currently running
    console.log('> scuttle-shell: starting')
    scuttleshell.start({}, (startErr) => {
      if (startErr) return console.error('> scuttle-shell: failed to start', startErr)

      startFrontend()
    })
  } else {
    console.log('> scuttle-shell / sbot already running')
    server.close() // close this connection (app starts one of its own)

    startFrontend()
  }
})
