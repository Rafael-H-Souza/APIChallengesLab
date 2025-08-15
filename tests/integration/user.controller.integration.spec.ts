// import { config } from "dotenv";
// import { UserController } from "../../src/controllers/user.controller";
// import { MongoClient, Db } from "mongodb";


// config();

// describe("UserController Integration Tests", () => {
//   jest.setTimeout(30000); 

//   let controller: UserController;
//   let client: MongoClient;
//   let db: Db;

//   beforeAll(async () => {
//     controller = new UserController();

//     const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
//     const dbName = process.env.MONGO_DB || "logs_db";

//     client = new MongoClient(mongoUri);
//     await client.connect();
//     db = client.db(dbName);
//   });

//   afterAll(async () => {
//     if (db) await db.collection("method_logs").deleteMany({});
//     if (client) await client.close();
//   });

//   it("should log success for valid user", async () => {
//     const user = await controller.getUser("1");
//     expect(user).toEqual({ id: "1", name: "Rafael Souza" });

//     const logs = await db.collection("method_logs").find({}).toArray();
//     expect(logs.length).toBeGreaterThan(0);
//     expect(logs[0]).toMatchObject({
//       class: "UserController",
//       method: "getUser",
//       error: null
//     });
//   });

//   it("should log error for invalid user", async () => {
//     await expect(controller.getUser("0")).rejects.toThrow("User not found");

//     const logs = await db.collection("method_logs").find({ error: { $ne: null } }).toArray();
//     expect(logs.length).toBeGreaterThan(0);
//     expect(logs[0].error).toBe("User not found");
//   });
// });
