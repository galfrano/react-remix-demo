import type { MenuItem } from "@prisma/client";
import { prisma } from "~/db.server";

export function getMenuItem({ id }: Pick<MenuItem, "id">) {
  return prisma.menuItem.findFirst({
    select: { item: true, price: true, categoryId: true, id: true },
    where: { id },
  });
}

export function getMenuItems() {
  return prisma.menuItem.findMany({
    select: { item: true, price: true, categoryId: true, id: true },
    orderBy: { categoryId: "desc" },
  });
}

export function getMenuItemsByCategory(categoryId) {
  return prisma.menuItem.findMany({
    where: { categoryId },
    select: { item: true, price: true, categoryId: true, id: true },
  });
}

export function createMenuItem({
  item,
  price,
  categoryId,
}: Pick<MenuItem, "item" | "price" | "categoryId">) {
  return prisma.menuItem.create({
    data: {
      item,
      price: parseFloat(price),
      categoryId,
    },
  });
}

export function deleteMenuItem({ id }: Pick<MenuItem, "id">) {
  return prisma.menuItem.delete({ where: { id } });
}
