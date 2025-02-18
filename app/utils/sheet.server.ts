import { PrismaClient, Sheet } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

type TGroupSheets = {
  today: Sheet[];
  yesterday: Sheet[];
  last30Days: Sheet[];
  more: Sheet[];
};
export async function getGroupedSheets(userId: string): Promise<TGroupSheets> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = subDays(todayStart, 1);
  const last30DaysStart = subDays(todayStart, 30);

  const sheets = await prisma.sheet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const groupedSheets: TGroupSheets = {
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

export async function getSheets(userId: string): Promise<Sheet[]> {
  const sheets = await prisma.sheet.findMany({
    where: { userId },
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
  if (existingSheet) {
    return {
      data: null,
      message: "Sheet dengan judul ini sudah ada..",
    };
  }
  const newSheet = await prisma.sheet.create({
    data: {
      title: title,
      titleId: generateTitleId(title),
      userId,
    },
  });
  return {
    data: newSheet,
    message: "ok",
  };
}
function generateTitleId(title: string): string {
  return title.split(" ").join("-");
}
