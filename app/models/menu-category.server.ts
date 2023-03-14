import type { MenuCategory } from "@prisma/client";
import { prisma } from "~/db.server";

export function getMenuCategory({ id }: Pick<MenuCategory, "id">) {
  return prisma.menuCategory.findFirst({
    select: { category: true, type: true, id: true },
    where: { id },
  });
}

export function getMenuCategories() {
  return prisma.menuCategory.findMany({
    select: { category: true, type: true, id: true },
    orderBy: { type: "desc" },
  });
}

export function createMenuCategory({
  category,
  type,
}: Pick<MenuCategory, "category" | "type">) {
  return prisma.menuCategory.create({
    data: {
      category,
      type,
    },
  });
}

export function deleteMenuCategory({ id }: Pick<MenuCategory, "id">) {
  return prisma.menuCategory.delete({ where: { id } });
}
