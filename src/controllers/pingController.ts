import { Request, Response } from 'express'
import { getPingService } from '../service/pinService'


export const getPingController = async (req: Request, res: Response) => {
  try {
    const result = await getPingService()

    if (!result.ok) {
      return res.status(500).json(result)
    }

    return res.json(result)
  } catch (error) {
    console.error('Controller Error:', error)

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
    })
  }
}