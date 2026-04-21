import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerAuthHandlers } from './ipc/auth'
import { registerLotesHandlers } from './ipc/lotes'
import { registerSerialHandlers } from './ipc/serial'
import { registerAdminHandlers } from './ipc/admin'
import { runMigrations } from './db/migrations'
import { closeDatabase } from './db/connection'

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: app.isPackaged,
    frame: !app.isPackaged,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      // preload compilado pelo electron-vite fica em out/preload/index.js
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Bloqueia abertura de links externos na janela do app
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}

app.whenReady().then(() => {
  runMigrations()
  registerAuthHandlers()
  registerLotesHandlers()
  registerSerialHandlers()
  registerAdminHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') app.quit()
})
