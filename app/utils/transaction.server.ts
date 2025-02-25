import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransaction = async (data: {
  sheetId: string;
  name: string;
  type: "in" | "out";
  nominal: number;
  assets: boolean;
  liabilities: boolean;
  expenseClassification?: string;
  notes?: string;
}) => {
  try {
    return await prisma.transaction.create({
      data: { ...data },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
};

export async function getTotalInAndOut(sheetId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { sheetId },
    select: { type: true, nominal: true },
  });

  let totalIn = 0;
  let totalOut = 0;

  for (const transaction of transactions) {
    if (transaction.type === "in") {
      totalIn += transaction.nominal;
    } else if (transaction.type === "out") {
      totalOut += transaction.nominal;
    }
  }

  return { totalIn, totalOut };
}

export const getTransactionsBySheet = async (sheetId: string) => {
  try {
    return await prisma.transaction.findMany({
      where: { sheetId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
};

export const getTransactionById = async (id: string) => {
  try {
    return await prisma.transaction.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw new Error("Failed to fetch transaction");
  }
};

export const updateTransaction = async ({
  id,
  ...data
}: {
  id: string;
  sheetId: string;
  name: string;
  type: "in" | "out";
  nominal: number;
  assets: boolean;
  liabilities: boolean;
  expenseClassification?: string;
  notes?: string;
  financialGoalId?: string;
}) => {
  try {
    const { financialGoalId, type, nominal, ...payload } = data;
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
      select: {
        financialGoalId: true,
        nominal: true,
        type: true,
        financialGoal: { select: { type: true } },
      },
    });

    if (!existingTransaction) throw new Error("Transaction not found");
    return await prisma.transaction.update({
      where: { id },
      data: {
        type,
        nominal,
        ...payload,
        financialGoalId: financialGoalId || null,
      },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    return await prisma.transaction.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
};

export async function getTotalLiabilitiesAndAssets(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { sheet: { userId } },
    select: { nominal: true, assets: true, liabilities: true },
  });

  let totalAssets = 0;
  let totalLiabilities = 0;

  for (const transaction of transactions) {
    if (transaction.assets) {
      totalAssets += transaction.nominal;
    }
    if (transaction.liabilities) {
      totalLiabilities += transaction.nominal;
    }
  }

  return { totalAssets, totalLiabilities };
}
