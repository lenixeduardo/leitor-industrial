import type { RxJsonSchema } from 'rxdb'

export interface LeituraPendenteDoc {
  id: string
  serial: string
  operario_id: string
  registrado_em: string
  latitude?: number
  longitude?: number
  synced: boolean
}

export const leituraSchema: RxJsonSchema<LeituraPendenteDoc> = {
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id:            { type: 'string', maxLength: 36 },
    serial:        { type: 'string', maxLength: 100 },
    operario_id:   { type: 'string', maxLength: 36 },
    registrado_em: { type: 'string', maxLength: 30 },
    latitude:      { type: 'number' },
    longitude:     { type: 'number' },
    synced:        { type: 'boolean' },
  },
  required: ['id', 'serial', 'operario_id', 'registrado_em', 'synced'],
}
