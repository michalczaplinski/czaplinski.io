// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { transformerMetaHighlight } from "@shikijs/transformers";

// https://astro.build/config
export default defineConfig({
  site: "https://czaplinski.io",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      transformers: [transformerMetaHighlight()],
      theme: {
        name: "blueprint",
        type: "dark",
        colors: {
          "editor.background": "#000033", // Matches global.css pre background
          "editor.foreground": "#ffffff",
        },
        tokenColors: [
          {
            scope: ["comment", "punctuation.definition.comment"],
            settings: {
              foreground: "#6699ff", // --blueprint-blue-light
              fontStyle: "italic",
            },
          },
          {
            scope: ["string", "punctuation.definition.string"],
            settings: {
              foreground: "#ccff00", // --neon-yellow
            },
          },
          {
            scope: [
              "keyword",
              "storage",
              "variable.language",
              "support.type",
              "support.class",
            ],
            settings: {
              foreground: "#ff00cc", // --neon-pink
              fontStyle: "bold",
            },
          },
          {
            scope: ["entity.name.function", "support.function"],
            settings: {
              foreground: "#ffffff",
              fontStyle: "bold",
            },
          },
          {
            scope: ["variable", "support.variable", "entity.name.type"],
            settings: {
              foreground: "#f0f0f0", // --blueprint-accent
            },
          },
          {
            scope: ["constant", "support.constant"],
            settings: {
              foreground: "#ccff00", // --neon-yellow
            },
          },
          // Fallback for other tokens to keep contrast
          {
            scope: ["punctuation", "meta.brace"],
            settings: {
              foreground: "#6699ff", // Use light blue for punctuation to be subtle but visible
            },
          },
        ],
      },
    },
  },
});
