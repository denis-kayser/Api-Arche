import { SpResult } from "../../types/response/response";
import { moduleModel } from "../../models/module/moduleModel";
import { MenuItem } from "../../types/routes/module/module";
import { toSlug } from "../../util/path";

// =======================================
// Modulos
// =======================================
export const moduleService = {
  getAllModule: async (): Promise<SpResult<MenuItem[]>> => {
    const modules = await moduleModel.getAllModule();

    if (modules.length === 0) {
      return {
        ok: true,
        message: 'No hay módulos registrados',
        data: []
      };
    }

    const map: Record<number, MenuItem> = {};
    const menuItems: MenuItem[] = [];

    modules.forEach((elem) => {
      const pathSegments = (elem.route ?? '').split('/');
      const href = '/' + pathSegments.map((segment: string) => toSlug(segment)).join('/');

      map[elem.id] = {
        id: elem.id,
        href: href,
        label: elem.name,
        active: elem.is_active,
        icons: elem.icon ?? '',
        children: []
      };
    });

    modules.forEach((elem) => {
      if (elem.parent_id === null) {
        menuItems.push(map[elem.id]);
      } else {
        if (map[elem.parent_id]) {
          map[elem.parent_id].children.push(map[elem.id]);
        }
      }
    });

    return {
      ok: true,
      message: 'Módulos obtenidos correctamente',
      data: menuItems
    };
  }
}
