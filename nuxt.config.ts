// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icons"],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
});
