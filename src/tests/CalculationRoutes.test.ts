import request from "supertest";
import express from "express";
import router from "../routes/CalculationRoutes";
import { CalculationService } from "../services/CalculationService";

const mockTestUserId: string = process.env.AUTH_KEY as string;

jest.mock("../middlewares/AuthMiddleware", () => ({
    authMiddleware: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.userId = mockTestUserId;
        next();
    },
}));

jest.mock("../utils/saveBackup", () => ({
    saveToBackupAPI: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api", router);

const mockEvaluate = jest.spyOn(CalculationService.prototype, "evaluateExpression");
const mockGetHistory = jest.spyOn(CalculationService.prototype, "getHistory");
const mockClearHistory = jest.spyOn(CalculationService.prototype, "clearHistory");

describe("Calculation Routes", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /api/calculate", () => {
        it("should return calculation result", async () => {
            mockEvaluate.mockResolvedValueOnce({ result: "42" });

            const res = await request(app)
                .post("/api/calculate")
                .send({ expression: "6*7" });

            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe("42");
            expect(mockEvaluate).toHaveBeenCalledWith("6*7", mockTestUserId);
        });

        it("should return 400 on invalid expression", async () => {
            mockEvaluate.mockRejectedValueOnce(new Error("Invalid Expression"));

            const res = await request(app)
                .post("/api/calculate")
                .send({ expression: "invalid" });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Invalid Expression");
        });
    });

    describe("GET /api/history", () => {
        it("should return history", async () => {
            const mockHistory = [
                { expression: "1+1", result: "2", createdAt: `${new Date()}` },
            ];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mockGetHistory.mockResolvedValueOnce(mockHistory as any);

            const res = await request(app).get("/api/history");

            expect(res.statusCode).toBe(200);
            expect(res.body.history).toEqual(mockHistory);
        });

        it("should return 400 on DB error", async () => {
            mockGetHistory.mockRejectedValueOnce(new Error("DB Error"));

            const res = await request(app).get("/api/history");

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("DB Error");
        });
    });

    describe("DELETE /api/history", () => {
        it("should clear history and return success", async () => {
            mockClearHistory.mockResolvedValueOnce();

            const res = await request(app).delete("/api/history");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("History cleared");
            expect(mockClearHistory).toHaveBeenCalledWith(mockTestUserId);
        });

        it("should return 400 on clear error", async () => {
            mockClearHistory.mockRejectedValueOnce(new Error("Clear Failed"));

            const res = await request(app).delete("/api/history");

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Clear Failed");
        });
    });
});
