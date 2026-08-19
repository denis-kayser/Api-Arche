import 'dotenv/config';
import { prisma } from '../src/config/prisma';

async function main() {
  const parent = await prisma.modules.findFirst({ where: { name: 'Mantenimientos' } });

  if (!parent) {
    throw new Error('No se encontró el módulo "Mantenimientos"');
  }

  const created = await prisma.modules.create({
    data: {
      name: 'Sesiones_activas',
      icon: 'heroicons-outline:signal',
      route: 'mantenimientos/sesiones',
      parent_id: parent.id,
      sort_order: 4,
    },
  });

  console.log('Creado:', created.id, created.name);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
