import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { beforeAll, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "../generated/prisma";
import { execSync } from "child_process";

let postgresContainer: StartedPostgreSqlContainer;
let prisma: PrismaClient;

const resetDb = async () => {
  await prisma.$transaction([
    prisma.grid.deleteMany(),
    prisma.player.deleteMany(),
  ]);
};

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer("postgres:18").start();
  execSync("npx prisma db push", {
    env: {
      ...process.env,
      DATABASE_URL: postgresContainer.getConnectionUri(),
    },
  });
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: postgresContainer.getConnectionUri(),
      },
    },
  });
}, 30000); // Increase timeout for starting the container

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await postgresContainer.stop();
  await prisma.$disconnect();
});

export const getPrismaTestClient = () => prisma;
