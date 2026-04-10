


// export const getUserService = async (filters: UserFilters): Promise<SpResponse<User[]>> => {
//   try {
//     const response = await getUserhModel(filters);

import { getUserhModel } from "../../models/users/userModel";
import { UserRegisterProps } from "../../types/users/register";
import { User, UserFilters } from "../../types/users/user";

//     if (!response) {
//       return {
//         ok: false,
//         message: 'No se pudo obtener la información',
//         data: null
//       }
//     }

//     return {
//       ok: true,
//       message: response.message,
//       data: response.data
//     }
//   } catch (error) {
//     console.error('Service Error:', error)
//     const message = error instanceof Error ? error.message : 'Error al obtener la información';
//     return {
//       ok: false,
//       message: message,
//       data: null
//     }
//   }
// }



export const getUserService = async (filters: UserFilters): Promise<User[]> => {
  try {
    const users = await getUserhModel(filters);

    return users;

  } catch (error) {
    console.error('Service Error:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error al obtener la información'
    );
  }
};
