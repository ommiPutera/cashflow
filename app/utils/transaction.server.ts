import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a Transaction
export const createTransaction = async (
  sheetId: string,
  name: string,
  type: "in" | "out",
  nominal: number,
  classification?: string,
  notes?: string,
) => {
  try {
    return await prisma.transaction.create({
      data: {
        sheetId,
        name,
        type,
        class: classification,
        nominal,
        notes,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
};

// Get all Transactions for a specific sheet
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

// Get a single Transaction by ID
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

// Update a Transaction
export const updateTransaction = async (
  id: string,
  data: Partial<{
    name: string;
    type: "in" | "out";
    class: "fixed" | "variable" | "occasional";
    nominal: number;
    notes?: string;
    financialGoalId?: string;
  }>,
) => {
  try {
    return await prisma.transaction.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
};

// Delete a Transaction
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
