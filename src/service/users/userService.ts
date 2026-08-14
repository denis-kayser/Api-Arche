import { getUserhModel, updateUserModel } from "../../models/users/userModel";
import { User, UserFilters, UpdateUserProps } from "../../types/users/user";

export const getUserService = async (filters: UserFilters): Promise<User[]> => {
  return getUserhModel(filters);
};

export const updateUserService = async (id: number, data: UpdateUserProps): Promise<User> => {
  return updateUserModel(id, data);
};
