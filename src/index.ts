import { get } from "env-var";
import express from "express";
import fs from "node:fs/promises";
import { ViteDevServer } from "vite";
import { Manifest } from "~/types";

serve();

async function serve() {
  const env = {
    isProduction: get("NODE_ENV").asString() === "production",
    port: get("PORT").default(5173).asPortNumber(),
    base: get("BASE").default("/").asString(),
  };

  const templateHtml = env.isProduction
    ? await fs.readFile("dist/client/index.html", "utf-8")
    : "";
  const ssrManifest = env.isProduction
    ? JSON.parse(
        await fs.readFile("dist/client/.vite/ssr-manifest.json", "utf-8")
      )
    : ({} as Manifest);

  // Create http server
  const app = express();

  // Add Vite or respective production middlewares
  let vite: ViteDevServer;
  if (!env.isProduction) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base: env.base,
    });
    app.use(vite.middlewares);
  } else {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(env.base, sirv("./dist/client", { extensions: [] }));
  }

  process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
  });

  // Serve HTML
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(env.base, "");

      let template;
      let render: typeof import("./entry-server")["render"];
      if (!env.isProduction) {
        // Always read fresh template in development
        template = await fs.readFile("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
      } else {
        template = templateHtml;

        //@ts-expect-error Unresolvable during dev
        render = (await import("dist/server/entry-server.mjs")).render;
      }

      const { html, modules, storeValue } = await render({
        manifest: ssrManifest,
        req,
      });

      const finalHtml = template
        .replace(`<!--app-html-->`, html)
        .replace("<!--app-head-->", modules)
        .replace(
          `<!--ssr-head-outlet-->`,
          `<script> window.__pinia = '${JSON.stringify(storeValue)}' </script>`
        );

      res.status(200).set({ "Content-Type": "text/html" }).send(finalHtml);
    } catch (e) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(env.port, () => {
    console.log(`Server started at http://localhost:${env.port}`);
  });
}
