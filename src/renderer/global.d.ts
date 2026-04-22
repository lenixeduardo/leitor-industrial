import type { BatchReaderAPI } from '../shared/types'

declare global {
  interface Window {
    batchReader: BatchReaderAPI
  }
}
