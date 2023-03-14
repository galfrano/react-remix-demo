import type { Table } from "@prisma/client";
import { prisma } from "~/db.server";

export function getTable({ id }: Pick<Table, "id">) {
  return prisma.table.findFirst({
    select: { table: true, id: true },
    where: { id },
  });
}

export function getTables() {
  return prisma.table.findMany({
    select: { table: true, id: true },
  });
}

export function createTable({ table }: Pick<Table, "table">) {
  return prisma.table.create({
    data: {
      table,
    },
  });
}

export function deleteTable({ id }: Pick<Table, "id">) {
  return prisma.table.delete({ where: { id } });
}
