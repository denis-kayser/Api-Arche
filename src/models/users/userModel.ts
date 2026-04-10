import { pool } from "../../config/conexion";
import { User, UserFilters } from "../../types/users/user";


// Obtener todos los usuarios o con filtros
// export const getUserhModel = async (filters: UserFilters): Promise<SpResponse<User[]>> => {


//   try {
//     const { name, isActive, rolId } = filters

//     // Llamar al SP con parámetros
//     const query = 'SELECT sp_getAllUsers($1, $2, $3) as result';
//     const values = [name ?? null, isActive ?? null, rolId ?? null];

//     const result = await pool.query(query, values);

//     console.log({ result });

//     if (!result.rows[0].result) {
//       return {
//         ok: false,
//         message: 'No se pudo obtener la información',
//         data: null
//       }
//     }

//     const response: SpResponse<User[]> = result.rows[0].result;

//     return response;
//   } catch (error: unknown) {
//     console.error('Error en getAllUsersModel:', error);
//     const message = error instanceof Error ? error.message : 'Error al obtener la información';
//     return {
//       ok: false,
//       message: message,
//       data: null
//     };
//   }
// }



type SpResult<T> = {
  ok: boolean;
  message: string;
  data: T;
};

export const getUserhModel = async (filters: UserFilters): Promise<User[]> => {
  try {
    const { name, isActive, rolId } = filters;

    const query = 'SELECT sp_getAllUsers($1, $2, $3) as result';
    const values = [name ?? null, isActive ?? null, rolId ?? null];

    const result = await pool.query(query, values);

    const spResult: SpResult<User[]> | undefined = result.rows[0]?.result;

    if (!spResult) {
      throw new Error('Respuesta vacía del procedimiento');
    }

    if (!spResult.ok) {
      throw new Error(spResult.message || 'Error en la consulta');
    }

    return spResult.data ?? [];

  } catch (error) {
    console.error('Error en getUserhModel:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error al obtener la información'
    );
  }
};






