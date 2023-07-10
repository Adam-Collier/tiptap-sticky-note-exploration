import { defineConfig } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/,
      ],
      // exclude files
      // exclude: []
    },
  },
});
