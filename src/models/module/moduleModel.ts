
import { pool } from "../../config/conexion";
import { SuccessCode } from "../../constants/successCodes";
import { SpResult } from "../../types/response/response";
import { Module } from "../../types/routes/module/module";

// ====================================
// Inicia Sesión
// ====================================
export const moduleModel = {
  getAllModule: async (): Promise<any> => {
    try {
  
      // Buscar usuario por email
      const query = `SELECT * FROM ft_getModules()`;
      const result = await pool.query(query);

      return result


    } catch (error) {
      console.error('Error en moduleModel.getAllModule:', error);
      throw error
    }
  }
}
