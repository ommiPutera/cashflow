import { PrismaClient, type Sheet } from "@prisma/client";

import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

type TGroupSheets = {
  today: Sheet[];
  yesterday: Sheet[];
  last7Days: Sheet[];
  last30Days: Sheet[];
  more: Sheet[];
};
export async function getGroupedSheets(userId: string): Promise<TGroupSheets> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = subDays(todayStart, 1);
  const last7aysStart = subDays(todayStart, 7);
  const last30DaysStart = subDays(todayStart, 30);

  const sheets = await prisma.sheet.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });

  const groupedSheets: TGroupSheets = {
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    more: [],
  };

  for (const sheet of sheets) {
    const updatedAt = new Date(sheet.updatedAt);

    if (updatedAt >= todayStart) {
      groupedSheets.today.push(sheet);
    } else if (updatedAt >= yesterdayStart) {
      groupedSheets.yesterday.push(sheet);
    } else if (updatedAt >= last7aysStart) {
      groupedSheets.last7Days.push(sheet);
    } else if (updatedAt >= last30DaysStart) {
      groupedSheets.last30Days.push(sheet);
    } else {
      groupedSheets.more.push(sheet);
    }
  }

  return groupedSheets;
}

export async function getSheets(userId: string): Promise<Sheet[]> {
  const sheets = await prisma.sheet.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
  return sheets;
}

export async function getDeletedSheets(userId: string): Promise<Sheet[]> {
  const sheets = await prisma.sheet.findMany({
    where: { userId, deletedAt: { not: null } },
    orderBy: { createdAt: "desc" },
  });
  return sheets;
}

export async function createSheet(
  title: string,
  userId: string,
): Promise<{ data: Sheet | null; message: string }> {
  const existingSheet = await prisma.sheet.findFirst({
    where: { title, userId },
  });
  console.log("existingSheet: ", existingSheet);
  if (existingSheet) {
    return {
      data: null,
      message: "Sheet dengan judul ini sudah ada..",
    };
  }
  const newSheet = await prisma.sheet.create({
    data: {
      title,
      titleId: title.replace(/\s/g, "").split(" ").join("-"),
      userId,
      deletedAt: null,
    },
  });
  return {
    data: newSheet,
    message: "ok",
  };
}

export async function getSheet(
  titleId: string,
  userId: string,
): Promise<Sheet | null> {
  const sheet = await prisma.sheet.findUnique({
    where: { titleId, userId },
  });
  if (!sheet) {
    return null;
  }
  await prisma.sheet.update({
    where: { id: sheet.id },
    data: { updatedAt: new Date() },
  });
  return sheet;
}

export async function getSheetById(id: string): Promise<Sheet | null> {
  const sheet = await prisma.sheet.findUnique({
    where: { id },
  });
  if (!sheet) {
    return null;
  }
  await prisma.sheet.update({
    where: { id },
    data: { updatedAt: new Date() },
  });
  return sheet;
}

export async function deleteSheet(
  id: string,
  userId: string,
): Promise<Sheet | null> {
  const existingSheet = await prisma.sheet.findUnique({
    where: { id, userId },
  });
  if (!existingSheet) return null;

  return await prisma.sheet.update({
    where: { id, userId },
    data: { deletedAt: new Date() },
  });
}

export async function recoverSheet(
  id: string,
  userId: string,
): Promise<Sheet | null> {
  return await prisma.sheet.update({
    where: { id, userId },
    data: { deletedAt: null },
  });
}

export async function deletePermanentlySheet(
  id: string,
  userId: string,
): Promise<Sheet | null> {
  return await prisma.sheet.delete({
    where: { id, userId },
  });
}
