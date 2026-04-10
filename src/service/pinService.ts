import { getPingModelo } from "../models/pingModel"

export const getPingService = async () => {
  try {
    const isConnected = await getPingModelo()

    if (!isConnected) {
      return {
        ok: false,
        message: 'No hay conexión con la base de datos',
      }
    }

    return {
      ok: true,
      message: 'Conexión a la base de datos OK',
      result: 'pong'
    }
  } catch (error) {
    console.error('Service Error:', error)

    return {
      ok: false,
      message: 'Error al verificar la base de datos',
    }
  }
}