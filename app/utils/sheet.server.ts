import { PrismaClient, Sheet } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function getSheets() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = subDays(todayStart, 1);
  const last30DaysStart = subDays(todayStart, 30);

  const sheets = await prisma.sheet.findMany({
    orderBy: { createdAt: "desc" },
  });

  const groupedSheets: Record<string, Sheet[]> = {
    today: [],
    yesterday: [],
    last30Days: [],
    more: [],
  };

  for (const sheet of sheets) {
    const createdAt = new Date(sheet.createdAt);

    if (createdAt >= todayStart) {
      groupedSheets.today.push(sheet);
    } else if (createdAt >= yesterdayStart) {
      groupedSheets.yesterday.push(sheet);
    } else if (createdAt >= last30DaysStart) {
      groupedSheets.last30Days.push(sheet);
    } else {
      groupedSheets.more.push(sheet);
    }
  }

  return groupedSheets;
}

export async function createSheet(
  title: string,
  userId: string,
): Promise<Sheet | string> {
  const existingSheet = await prisma.sheet.findFirst({
    where: { title, userId },
  });
  if (existingSheet) {
    return "Sheet dengan judul ini sudah ada..";
  }

  const newSheet = await prisma.sheet.create({
    data: {
      title: title,
      userId,
    },
  });

  return newSheet;
}
