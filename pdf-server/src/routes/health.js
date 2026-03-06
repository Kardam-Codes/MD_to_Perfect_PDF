export function registerHealthRoutes(app, browserPool) {
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      service: "md-to-perfect-pdf",
      version: "1.1.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      browserPool: {
        active: browserPool.activeCount,
        available: browserPool.pool.length,
        maxSize: browserPool.maxSize
      },
      message: "Use POST /export to generate PDFs"
    });
  });

  app.get("/health", (req, res) => {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      memory: {
        rss: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
        heapTotal: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsed: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
        external: Math.round((memUsage.external / 1024 / 1024) * 100) / 100
      },
      browserPool: {
        active: browserPool.activeCount,
        available: browserPool.pool.length,
        maxSize: browserPool.maxSize,
        utilization: Math.round((browserPool.activeCount / browserPool.maxSize) * 100)
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    });
  });
}
