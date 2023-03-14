import type { Check } from "@prisma/client";
import { prisma } from "~/db.server";

export function getCheck({ id }: Pick<Check, "id">) {
  return prisma.check.findFirst({
    select: {
      createdAt: true,
      tableId: true,
      userId: true,
      note: true,
      id: true,
    },
    where: { id },
  });
}

export function getChecks() {
  return prisma.check.findMany({
    select: {
      createdAt: true,
      tableId: true,
      userId: true,
      note: true,
      id: true,
    },
  });
}

export function createCheck({
  tableId,
  userId,
  note,
}: Pick<Check, "createdAt" | "tableId" | "userId" | "note">) {
  return prisma.check.create({
    data: {
      tableId,
      userId,
      note,
    },
  });
}

export function deleteCheck({ id }: Pick<Check, "id">) {
  return prisma.check.delete({ where: { id } });
}
