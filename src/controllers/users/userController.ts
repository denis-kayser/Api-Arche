
import { UserFilters } from "../../types/users/user"
import { getUserService } from "../../service/users/userService"
import { ParamsType } from "../../types/express/express"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";


// export const userController: ParamsType = async (req, res) => {

//   try {
//     const { name, isActive, rolId } = req.query

//     const filters: UserFilters = {
//       name: name as string ?? null,
//       isActive: isActive !== undefined ? isActive === 'true' : null,
//       rolId: rolId !== undefined ? Number(rolId) : null
//     }

//     const result = await getUserService(filters)
//     console.log({ result });


//     if (!result.ok) {
//       return res.status(204).json(result)
//     }

//     return res.status(200).json(result)
//   } catch (error) {
//     console.error('Controller Error:', error)
//     const message = error instanceof Error ? error.message : 'Error al obtener la información';
//     return res.status(500).json({
//       ok: false,
//       message: message,
//     })

//   }
// }


export const userController: ParamsType = async (req, res) => {
  
  try {
    const { name, isActive, rolId } = req.query;

    const filters: UserFilters = {
      name: (name as string) ?? null,
      isActive: isActive !== undefined ? isActive === 'true' : null,
      rolId: rolId !== undefined ? Number(rolId) : null
    };

    const users = await getUserService(filters);

    if (users.length === 0) {
      return response.success(
        res,
        SuccessCode.EMPTY,
        'No hay usuarios',
        [],
        204
      );
    }

    return response.success(
      res,
      SuccessCode.LIST_FETCHED,
      'Usuarios obtenidos',
      users
    );

  } catch (error) {
    console.error('Controller Error:', error);

    return response.error(
      res,
      ErrorCode.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'Error al obtener la información'
    );
  }
};








// export const registerController: ParamsType = async (req, res) => {
//   try {
//     const { name, email, password, rolID } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         ok: false,
//         message: 'Todos los campos son requeridos',
//         data: null,
//       });
//     }

//     const data: UserRegisterProps = { name, email, password, rolID };

//     const result = await postUserRegisterService(data);

//     if (!result.ok) {
//       return res.status(400).json(result);
//     }

//     return res.status(201).json(result);

//   } catch (error) {
//     console.error('Controller Error:', error);
//     const message = error instanceof Error ? error.message : 'Error al registrar usuario';
//     return res.status(500).json({
//       ok: false,
//       message: message,
//       data: null,
//     });
//   }
// };