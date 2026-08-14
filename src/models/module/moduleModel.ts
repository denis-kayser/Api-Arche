import { prisma } from "../../config/prisma";

export const moduleModel = {
  getAllModule: async () => {
    try {
      return await prisma.modules.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' },
      });
    } catch (error) {
      console.error('Error en moduleModel.getAllModule:', error);
      throw error
    }
  }
}
