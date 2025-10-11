import app from "./src/app";
import { config } from "./src/config";
import connectDB from "./src/db";

const startServer = async () => {
  try {
    await connectDB();
    const port = config.port;
    app.listen(port, () => console.log("Server started on port", port));
  } catch (err) {
    console.error("Startup failed:", err);
  }
};

startServer();
