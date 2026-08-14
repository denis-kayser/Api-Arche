import 'dotenv/config';
import { prisma } from '../src/config/prisma';

type ChildDef = { name: string; icon: string; route: string; sort_order: number };
type GroupDef = { name: string; icon: string; route: string; sort_order: number; children: ChildDef[] };

const groups: GroupDef[] = [
  {
    name: 'Dashboard',
    icon: 'heroicons-outline:home',
    route: 'dashboard',
    sort_order: 10,
    children: [
      { name: 'Analitica', icon: 'heroicons-outline:chart-bar', route: 'dashboard/analytics', sort_order: 1 },
      { name: 'Banca', icon: 'heroicons-outline:credit-card', route: 'dashboard/banking', sort_order: 2 },
      { name: 'CRM', icon: 'heroicons-outline:users', route: 'dashboard/crm', sort_order: 3 },
      { name: 'E-commerce', icon: 'heroicons-outline:shopping-cart', route: 'dashboard/dash-ecom', sort_order: 4 },
      { name: 'Proyecto', icon: 'heroicons-outline:clipboard-document-list', route: 'dashboard/project', sort_order: 5 },
    ],
  },
  {
    name: 'Comercio_electronico',
    icon: 'heroicons-outline:building-storefront',
    route: 'ecommerce',
    sort_order: 20,
    children: [
      { name: 'Tienda', icon: 'heroicons-outline:shopping-bag', route: 'ecommerce/frontend', sort_order: 1 },
      { name: 'Lista_de_productos', icon: 'heroicons-outline:list-bullet', route: 'ecommerce/frontend/list', sort_order: 2 },
      { name: 'Carrito', icon: 'heroicons-outline:shopping-cart', route: 'ecommerce/frontend/checkout/cart', sort_order: 3 },
      { name: 'Lista_de_deseos', icon: 'heroicons-outline:heart', route: 'ecommerce/frontend/wishlist', sort_order: 4 },
      { name: 'Historial_de_compras', icon: 'heroicons-outline:clock', route: 'ecommerce/frontend/purchase-history', sort_order: 5 },
      { name: 'Agregar_producto', icon: 'heroicons-outline:plus-circle', route: 'ecommerce/backend/add-product', sort_order: 6 },
      { name: 'Lista_de_clientes', icon: 'heroicons-outline:user-group', route: 'ecommerce/backend/customer-list', sort_order: 7 },
      { name: 'Lista_de_pedidos', icon: 'heroicons-outline:clipboard-document', route: 'ecommerce/backend/order-list', sort_order: 8 },
      { name: 'Lista_de_compras', icon: 'heroicons-outline:document-text', route: 'ecommerce/backend/purchase-list', sort_order: 9 },
      { name: 'Vendedores', icon: 'heroicons-outline:identification', route: 'ecommerce/backend/sellers', sort_order: 10 },
      { name: 'Facturas', icon: 'heroicons-outline:receipt-percent', route: 'ecommerce/backend/invoice', sort_order: 11 },
    ],
  },
  {
    name: 'Utilidad',
    icon: 'heroicons-outline:squares-2x2',
    route: 'utility',
    sort_order: 40,
    children: [
      { name: 'Perfil', icon: 'heroicons-outline:user-circle', route: 'user-profile', sort_order: 1 },
      { name: 'Facturacion', icon: 'heroicons-outline:document-currency-dollar', route: 'utility/invoice', sort_order: 2 },
      { name: 'Precios', icon: 'heroicons-outline:currency-dollar', route: 'utility/pricing', sort_order: 3 },
      { name: 'Preguntas_frecuentes', icon: 'heroicons-outline:question-mark-circle', route: 'utility/faq', sort_order: 4 },
      { name: 'Configuracion', icon: 'heroicons-outline:cog-6-tooth', route: 'utility/settings', sort_order: 5 },
      { name: 'Blog', icon: 'heroicons-outline:newspaper', route: 'utility/blog', sort_order: 6 },
    ],
  },
];

async function main() {
  // Reordenar Mantenimientos para que quede después de Dashboard/Ecommerce
  await prisma.modules.updateMany({
    where: { name: 'Mantenimientos' },
    data: { sort_order: 30 },
  });

  for (const group of groups) {
    const parent = await prisma.modules.create({
      data: {
        name: group.name,
        icon: group.icon,
        route: group.route,
        parent_id: null,
        sort_order: group.sort_order,
      },
    });

    for (const child of group.children) {
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
    console.log(`Grupo "${group.name}" creado (id=${parent.id}) con ${group.children.length} hijos`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
