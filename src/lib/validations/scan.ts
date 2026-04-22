import { z } from 'zod'

export const scanSchema = z
  .object({
    serial: z.string().min(1, 'Serial é obrigatório'),
    registrado_em: z.string().datetime({ message: 'Data inválida' }),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => {
      const hasLat = data.latitude !== undefined
      const hasLon = data.longitude !== undefined
      return hasLat === hasLon
    },
    { message: 'latitude e longitude devem ser fornecidos juntos' }
  )

export type ScanInput = z.infer<typeof scanSchema>
