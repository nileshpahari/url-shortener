import dotenv from "dotenv";
import app from "./app.ts";
import { dbConnect } from "./db/index.ts";

const PORT = process.env.PORT || 8080;

dotenv.config();

(async () => {
  try {
    await dbConnect();
    const server = app.listen(PORT, () => {
      console.log("Started listening at port ", PORT);
    });
    server.on("error", (err) => {
      console.error("Server failed to start", err);
      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Error occured during startup, exiting the process...",
      error
    );
    process.exit(1);
  }
})();
