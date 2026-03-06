import { createApp } from "./src/app.js";
import { PORT } from "./src/config.js";

const { app, browserPool } = createApp();

process.on("SIGINT", async () => {
  console.log("Shutting down browser pool...");
  await browserPool.closeAll();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down browser pool...");
  await browserPool.closeAll();
  process.exit(0);
});

export { app };

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`PDF server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log("Rate limiting: 20 requests per 15 minutes");
    console.log("CORS: Restricted to allowed origins");
  });
}
