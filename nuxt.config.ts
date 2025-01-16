import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config

// site env
const siteConfig = {
  siteTitle: process.env.SITE_TITLE || "IMSYY 站点监测",
  siteDescription: process.env.SITE_DESCRIPTION || "一个简约的站点监测",
  siteKeywords: process.env.SITE_KEYWORDS || "站点监测,监测,监控",
  siteLogo: process.env.SITE_LOGO || "/favicon.ico",
  siteIcp: process.env.SITE_ICP || "",
  countDays: Number(process.env.COUNT_DAYS || 60),
  showLink: process.env.SHOW_LINK === "true" || true,
  platform: process.env.DEPLOYMENT_PLATFORM || "cloudflare",
  version: pkg.version,
};

export default defineNuxtConfig({
  // modules
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
    "@nuxt/eslint",
    "nuxtjs-naive-ui",
    "@vite-pwa/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-lodash",
    "@nuxtjs/i18n",
  ].concat(siteConfig.platform === "cloudflare" ? "@nuxthub/core" : ""),
  // ssr
  ssr: false,
  // devtools
  devtools: { enabled: true },
  // app
  app: {
    rootAttrs: { id: "nuxt-app" },
    // site-meta
    head: {
      title: siteConfig.siteTitle,
      meta: [
        {
          name: "description",
          content: siteConfig.siteDescription,
        },
        {
          name: "keywords",
          content: siteConfig.siteKeywords,
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ],
      link: [
        { rel: "icon", href: siteConfig.siteLogo },
        {
          rel: "apple-touch-icon",
          href: "/images/icons/normal/apple-touch-icon-180x180.png",
          sizes: "180x180",
        },
        {
          rel: "mask-icon",
          href: "/images/icons/normal/maskable-icon-512x512.png",
          color: "#ffffff",
        },
        // manifest
        process.env.NODE_ENV !== "development"
          ? {
              rel: "manifest",
              href: "/manifest.webmanifest",
            }
          : undefined,
      ],
      htmlAttrs: {
        lang: "zh-CN",
      },
    },
  },
  // css
  css: ["~/style/main.scss", "~/style/animate.scss"],
  // env
  runtimeConfig: {
    apiUrl: process.env.API_URL || "https://api.uptimerobot.com/v2/",
    apiKey: process.env.API_KEY,
    sitePassword: process.env.SITE_PASSWORD,
    siteSecretKey: process.env.SITE_SECRE_KEY || "site-status",
    public: siteConfig,
  },
  devServer: { port: 8566 },
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-11",
  // vite
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  },
  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: "double",
        semi: true,
      },
    },
  },
  // i18n
  i18n: {
    vueI18n: "./lang/i18n.config.ts",
  },
  // icon
  icon: {
    mode: "svg",
    customCollections: [
      {
        prefix: "icon",
        dir: "./app/assets/icons",
        normalizeIconName: false,
      },
    ],
  },
  // pwa
  pwa: {
    manifest: {
      name: siteConfig.siteTitle,
      short_name: siteConfig.siteDescription,
      description: siteConfig.siteDescription,
      theme_color: "#ffffff",
      icons: [
        {
          src: "/images/icons/normal/pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "/images/icons/normal/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/icons/normal/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/images/icons/normal/maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },
});
