import { ipcMain, BrowserWindow } from 'electron'
import { SerialPort } from 'serialport'
import type {
  SerialReadAllPayload,
  SerialReadAllResult,
  SerialReadResult,
} from '../../shared/types'
import { insertLeituras } from '../db/repositories/leituras'

// Portas configuráveis por plataforma
const SERIAL_PORTS: string[] =
  process.platform === 'win32'
    ? ['COM1', 'COM2', 'COM3', 'COM4', 'COM5']
    : ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyUSB2', '/dev/ttyUSB3', '/dev/ttyUSB4']

const TIMEOUT_MS = 3000

// Leitura one-shot: abre porta → aguarda evento data → fecha
// Falha em uma porta não cancela as demais (Promise.all com resolve individual)
function readPort(portName: string): Promise<SerialReadResult> {
  return new Promise((resolve) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout>

    const settle = (valor: string) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (port.isOpen) port.close(() => {})
      resolve({ porta: portName, valor })
    }

    const port = new SerialPort({ path: portName, baudRate: 9600, autoOpen: false })

    port.on('data', (data: Buffer) => {
      settle(data.toString('utf8').trim())
    })

    port.on('error', (err: Error) => {
      settle(`ERRO:${err.message}`)
    })

    port.open((openErr) => {
      if (openErr) {
        settle(`ERRO:${openErr.message}`)
        return
      }
      // Timer só inicia após abertura bem-sucedida da porta
      timer = setTimeout(() => settle('TIMEOUT'), TIMEOUT_MS)
    })
  })
}

export function registerSerialHandlers(): void {
  ipcMain.handle(
    'serial:read-all',
    async (event, payload: SerialReadAllPayload): Promise<SerialReadAllResult> => {
      try {
        // Lê todas as 5 portas em paralelo; erros individuais são capturados por porta
        const leituras = await Promise.all(SERIAL_PORTS.map(readPort))

        // Salva em transação atômica única
        insertLeituras(payload.loteId, payload.operadorId, leituras)

        // Notifica renderer para navegar à tela de hibernação
        const win = BrowserWindow.fromWebContents(event.sender)
        win?.webContents.send('serial:complete')

        return { success: true, leituras }
      } catch (err) {
        return { success: false, leituras: [], error: String(err) }
      }
    }
  )
}
