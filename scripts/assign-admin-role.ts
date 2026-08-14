import 'dotenv/config';
import { prisma } from '../src/config/prisma';

async function main() {
  const adminRole = await prisma.roles.findFirst({ where: { description: 'ADMIN' } });

  if (!adminRole) {
    throw new Error('No se encontró el rol ADMIN');
  }

  const updated = await prisma.users.update({
    where: { id: 5 },
    data: { rol_id: adminRole.id },
  });

  console.log(`Usuario ${updated.email} (id=${updated.id}) ahora tiene rol ADMIN (id=${adminRole.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
