import { describe, test, beforeAll, expect } from "vitest";
import { PrismaClient } from "../../../../generated/prisma";
import { getPrismaTestClient } from "@/../test/setupIntegration";
import { PrismaGridRepository } from "../repositories/PrismaGridRepository";
import { Grid } from "@/pixelwar-context/domain/Grid.entity";
import { PrismaGridQueries } from "./PrismaGridQueries";

describe("", () => {
  let prisma: PrismaClient;
  beforeAll(async () => {
    prisma = getPrismaTestClient();
  });
  test("Should fetch the most recent grid", async () => {
    // Arrange
    const repository = new PrismaGridRepository(prisma);
    const queries = new PrismaGridQueries(prisma);
    const grid1 = Grid.withDimensions(5, 5);
    const grid2 = Grid.withDimensions(6, 6);
    await repository.save(grid1);
    await repository.save(grid2);

    // Act
    const foundGrid = await queries.findLatestGrid();

    // Assert
    expect(foundGrid).not.toBeNull();
    expect(foundGrid?.gridId).toBe(grid2.id.id());
    expect(foundGrid?.cells.length).toBe(6);
    expect(foundGrid?.cells[0].length).toBe(6);
  });
});
