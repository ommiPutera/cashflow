import { PrismaClient, FinancialGoalType, FinancialGoal } from "@prisma/client";

const prisma = new PrismaClient();

export async function getFinancialGoals(
  userId: string,
  type?: FinancialGoalType,
): Promise<(FinancialGoal & { totalIn: number; totalOut: number })[]> {
  const financialGoals = await prisma.financialGoal.findMany({
    where: { userId, type },
    orderBy: { createdAt: "desc" },
    include: {
      transactions: {
        select: { type: true, nominal: true },
      },
    },
  });

  return financialGoals.map((goal) => {
    let totalIn = 0,
      totalOut = 0;
    for (const { type, nominal } of goal.transactions) {
      if (type === "in") totalIn += nominal;
      else totalOut += nominal;
    }
    return { ...goal, totalIn, totalOut };
  });
}

export async function getFinancialGoalById(id: string, userId: string) {
  const financialGoal = await prisma.financialGoal.findUnique({
    where: { id, userId },
    include: {
      transactions: {
        where: { financialGoalId: id },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!financialGoal) return null;

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: { financialGoalId: id },
    _sum: { nominal: true },
  });

  const totalOut = totals.find((t) => t.type === "out")?._sum.nominal || 0;
  const totalIn = totals.find((t) => t.type === "in")?._sum.nominal || 0;
  return { ...financialGoal, totalOut, totalIn };
}

export async function createFinancialGoal(data: {
  userId: string;
  title: string;
  targetAmount: number;
  description?: string;
  type: FinancialGoalType;
}) {
  const { title, userId } = data;
  const existingFinancialGoal = await prisma.financialGoal.findFirst({
    where: { title, userId },
  });

  if (existingFinancialGoal) {
    return {
      data: null,
      message: "Sheet dengan judul ini sudah ada..",
    };
  }

  const newFinancialGoal = await prisma.financialGoal.create({ data });
  return {
    data: newFinancialGoal,
    message: "ok",
  };
}

export async function updateFinancialGoal(
  id: string,
  data: Partial<{
    name: string;
    targetAmount: number;
    description: string;
  }>,
) {
  return await prisma.financialGoal.update({ where: { id }, data });
}

export async function deleteFinancialGoal(id: string) {
  return await prisma.financialGoal.delete({ where: { id } });
}
