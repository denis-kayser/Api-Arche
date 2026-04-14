import { SpResult } from "../../types/response/response";
import { moduleModel } from "../../models/module/moduleModel";
import { MenuItem } from "../../types/routes/module/module";
import { toSlug } from "../../util/path";
import { isDatabaseError } from "../../util/errors";


// =======================================
// Modulos
// =======================================
export const moduleService = {
  getAllModule: async (): Promise<SpResult<MenuItem[]>> => {
    try {
      const response = await moduleModel.getAllModule();


      if (response.rows.length === 0) {
        return {
          ok: true,
          message: 'No hay módulos registrados',
          data: []
        };
      }

      const map: Record<number, MenuItem> = {};
      const menuItems: MenuItem[] = [];

      response.rows.forEach((elem: any) => {

        const pathSegments = elem.PATH.split('/');
        const href = '/' + pathSegments.map((segment: string) => toSlug(segment)).join('/');

        map[elem.ID] = {
          id: elem.ID,
          href: href,
          label: elem.DESCRIPTION,
          active: elem.IS_ACTIVE,
          icons: elem.ICON,
          children: []
        };
      });

      response.rows.forEach((elem: any) => {
        if (elem.PARENT_ID === null) {
          menuItems.push(map[elem.ID]);
        } else {
          if (map[elem.PARENT_ID]) {
            map[elem.PARENT_ID].children.push(map[elem.ID]);
          }
        }
      });

      return {
        ok: true,
        message: 'Módulos obtenidos correctamente',
        data: menuItems
      };

    } catch (error) {
      console.error('Service Error:', error);

      if (isDatabaseError(error)) throw error  

      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error al obtener módulos',
        data: []
      };
    }
  }
}