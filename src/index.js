const {app, BrowserWindow, Menu, ipcMain, Notification} = require('electron');
const path = require('path');
let mainWindow;
const dockMenu = Menu.buildFromTemplate([
  {
    label: '开始工作',
    click () {
      mainWindow.webContents.send('main-click-messages', 1)
    }
  },
  {
    label: '结束工作',
    click () {
      mainWindow.webContents.send('main-click-messages', 2)
    }
  }
])

function handleIPC() {
  ipcMain.on('notification', async (e, {body, title, actions, closeButtonText}) => {
    let res = await new Promise((resolve, reject) => {
      let notification = new Notification({
        title,
        body,
        actions,
        closeButtonText
      })
      notification.show()
      notification.on('action', function(event) {
        resolve({event: 'action'})
      })
      notification.on('close', function(event) {
        resolve({event: 'close'})
      })
    })
    return res
  })
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 250,
    height: 350,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(path.resolve(__dirname, './index.html'));
  return mainWindow
}

app.whenReady().then(() => {
  handleIPC()
  createMainWindow()
  app.dock.setMenu(dockMenu)
})

