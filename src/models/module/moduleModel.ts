
import { pool } from "../../config/conexion";
import { SuccessCode } from "../../constants/successCodes";
import { SpResult } from "../../types/response/response";
import { Module } from "../../types/routes/module/module";

// ====================================
// Inicia Sesión
// ====================================
export const moduleModel = {
  getAllModule: async (): Promise<SpResult<Module[]>> => {
    try {
  
      // Buscar usuario por email
      const query = `SELECT * FROM ft_getModules()`;
      const result = await pool.query(query);

      return {
        ok: true,
        message: 'Módulos obtenidos exitosamente',
        code: SuccessCode.SUCCESS,
        data: result.rows
      };


    } catch (error) {
      console.error('Error en moduleModel.getModulesTree:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al obtener los módulos'
      );
    }
  }
}
