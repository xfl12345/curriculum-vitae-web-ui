import { resolve } from "node:path";

import type { ServerOptions, UserConfig } from "vite";
import { createLogger, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import axios from "axios";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // https://vitejs.dev/config/
  const myViteConfig = {
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        mergeProps: true
      }),
      vueDevTools()
      // babel(),
      // AutoImport({
      //   imports: [
      //     "vue",
      //     {
      //       "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
      //     }
      //   ]
      // }),
      // Components({
      //   resolvers: [NaiveUiResolver()]
      // })
    ],
    assetsInclude: ["**/*.bmp"],
    resolve: {
      alias: {
        // "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@": resolve(__dirname, "src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.mjs"
      }
    },
    build: {
      assetsDir: "static/",
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
    base: "./"
  } as UserConfig;

  // 先判断一下是否处于开发模式，再决定是否启用 server
  if (mode === "development") {
    const remoteServerHttpScheme = JSON.parse(env.VITE_REMOTE_SERVER_ENABLE_HTTPS ?? "false")
      ? "https"
      : "http";
    const remoteServerWebSocketScheme = JSON.parse(env.VITE_REMOTE_SERVER_ENABLE_WSS ?? "false")
      ? "wss"
      : "ws";

    const remoteServerHost = env.VITE_SERVER_REMOTE_HOST ?? "127.0.0.1:8880";
    const remoteServerRootURL = remoteServerHttpScheme + "://" + remoteServerHost;

    const logger = createLogger("info", { prefix: "[vite:dynamic-mock-server]" });
    const justLog = (...msg: any[]) => logger.info(msg.join(" "), { clear: false, timestamp: true });
    justLog("remoteServerRootURL=" + remoteServerRootURL);
    myViteConfig.server = {
      // hmr: {
      //   overlay: false
      // },
      // open: true, // 在服务器启动时自动在浏览器中打开应用程序
      // //host: 'localhost',  // 指定服务器主机名
      // // host: '0.0.0.0',
      // // host: '::',
      host: "::",
      proxy: {
        "/static/secret/": {
          target: remoteServerRootURL,
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/backend/, "")
        },
        "/static/public/": {
          target: remoteServerRootURL,
          changeOrigin: true
        },
        "/captcha": {
          target: remoteServerRootURL,
          changeOrigin: true
        },
        "/login": {
          target: remoteServerRootURL,
          changeOrigin: true
        },
        "/logout": {
          target: remoteServerRootURL,
          changeOrigin: true
        },
        "/sms": {
          target: remoteServerRootURL,
          changeOrigin: true
        },
        "/sms/ws-connect": {
          target: remoteServerWebSocketScheme + "://" + remoteServerHost,
          changeOrigin: true
        }
      }
    } as Partial<ServerOptions>;

    try {
      // 验证 远程API 是否可用
      await axios.get(remoteServerRootURL + "/login/status");
      justLog("Remote server API request succeed!");
      return myViteConfig;
    } catch (error) {
      // 当 远程API 不可用的时候，使用 mock
      justLog("Remote server API request failed! Use mock instead.");
      myViteConfig.plugins!.push(mockDevServerPlugin());
      return myViteConfig;
    }
  } else {
    return myViteConfig;
  }
});
