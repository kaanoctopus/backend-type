import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import calculationRoutes from "../../routes/CalculationRoutes";
import authRoutes from "../../routes/AuthRoutes";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.options("*", cors());

async function testConnection() {
    try {
        await prisma.$connect();
        console.log("Prisma connected to the database");
    } catch (error) {
        console.error("Prisma connection error:", error);
    }
}

testConnection();

app.use("/api/", calculationRoutes);
app.use("/api/auth", authRoutes);

module.exports.handler = serverless(app);

