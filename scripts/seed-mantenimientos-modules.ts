import 'dotenv/config';
import { prisma } from '../src/config/prisma';

async function main() {
  const parent = await prisma.modules.create({
    data: {
      name: 'Mantenimientos',
      icon: 'heroicons-outline:wrench-screwdriver',
      route: 'mantenimientos',
      parent_id: null,
      sort_order: 90,
    },
  });

  const children = [
    { name: 'Tipos_de_documento', icon: 'heroicons-outline:document-text', route: 'mantenimientos/tipos-de-documento', sort_order: 1 },
    { name: 'Roles', icon: 'heroicons-outline:shield-check', route: 'mantenimientos/roles', sort_order: 2 },
    { name: 'Permisos', icon: 'heroicons-outline:key', route: 'mantenimientos/permisos', sort_order: 3 },
  ];

  for (const child of children) {
    await prisma.modules.create({
      data: {
        name: child.name,
        icon: child.icon,
        route: child.route,
        parent_id: parent.id,
        sort_order: child.sort_order,
      },
    });
  }

  console.log('Seed listo. Parent id:', parent.id);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
