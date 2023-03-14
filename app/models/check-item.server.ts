import type { CheckItem } from "@prisma/client";
import { prisma } from "~/db.server";

export function getCheckItems({ checkId }: Pick<CheckItem, "checkId">) {
  return prisma.checkItem.findMany({
    select: { createdAt: true, price: true, menuItemId: true, id: true },
    where: { checkId },
    orderBy: { createdAt: "desc" },
  });
}

export function createCheckItem({
  price,
  menuItemId,
  checkId,
}: Pick<CheckItem, "price" | "menuItemId" | "checkId">) {
  return prisma.checkItem.create({
    data: {
      price,
      menuItemId,
      checkId,
    },
  });
}

export function deleteCheckItems({ id }: Pick<CheckItem, "id">) {
  return prisma.checkItems.delete({ where: { id } });
}
