// vite.config.mjs
import { defineConfig } from "file:///home/runner/workspace/node_modules/vite/dist/node/index.js";
import react from "file:///home/runner/workspace/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import viteCompression from "file:///home/runner/workspace/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///home/runner/workspace/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/home/runner/workspace/apps/client";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: process.env.ANALYZE === "true",
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz"
    }),
    viteCompression({
      verbose: process.env.ANALYZE === "true",
      disable: false,
      threshold: 10240,
      algorithm: "brotliCompress",
      ext: ".br"
    }),
    ...process.env.ANALYZE === "true" ? [visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    })] : []
  ],
  server: {
    host: "0.0.0.0",
    port: 5e3,
    strictPort: false,
    watch: {
      usePolling: true,
      ignored: ["**/node_modules/**", "**/dist/**"]
    },
    hmr: {
      overlay: true,
      clientPort: 5e3
    },
    cors: true,
    fs: {
      strict: false,
      allow: [".."]
    }
  },
  preview: { port: 4173 },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@assets": path.resolve(__vite_injected_original_dirname, "../../attached_assets"),
      "@shared": path.resolve(__vite_injected_original_dirname, "../shared")
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1e3,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query";
            }
            if (id.includes("wouter")) {
              return "router";
            }
            if (id.includes("lucide-react")) {
              return "ui";
            }
            return "vendor";
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|otf|eot/i.test(ext || "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js"
      },
      treeshake: {
        moduleSideEffects: "no-external",
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "wouter", "@tanstack/react-query", "lucide-react"],
    exclude: [],
    esbuildOptions: {
      target: "esnext"
    }
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" }
  },
  json: {
    stringify: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHBzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHBzL2NsaWVudC92aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHBzL2NsaWVudC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICB2ZXJib3NlOiBwcm9jZXNzLmVudi5BTkFMWVpFID09PSAndHJ1ZScsXG4gICAgICBkaXNhYmxlOiBmYWxzZSxcbiAgICAgIHRocmVzaG9sZDogMTAyNDAsXG4gICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgIGV4dDogJy5neicsXG4gICAgfSksXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgIHZlcmJvc2U6IHByb2Nlc3MuZW52LkFOQUxZWkUgPT09ICd0cnVlJyxcbiAgICAgIGRpc2FibGU6IGZhbHNlLFxuICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4dDogJy5icicsXG4gICAgfSksXG4gICAgLi4uKHByb2Nlc3MuZW52LkFOQUxZWkUgPT09ICd0cnVlJyA/IFt2aXN1YWxpemVyKHtcbiAgICAgIGZpbGVuYW1lOiAnLi9kaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgfSldIDogW10pLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogNTAwMCxcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSxcbiAgICB3YXRjaDogeyBcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsXG4gICAgICBpZ25vcmVkOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9kaXN0LyoqJ11cbiAgICB9LFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogdHJ1ZSxcbiAgICAgIGNsaWVudFBvcnQ6IDUwMDAsXG4gICAgfSxcbiAgICBjb3JzOiB0cnVlLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgICAgYWxsb3c6IFsnLi4nXVxuICAgIH1cbiAgfSxcbiAgcHJldmlldzogeyBwb3J0OiA0MTczIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAYXNzZXRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL2F0dGFjaGVkX2Fzc2V0cycpLFxuICAgICAgJ0BzaGFyZWQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc2hhcmVkJylcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBjc3NNaW5pZnk6IHRydWUsXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiB0cnVlLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncXVlcnknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd3b3V0ZXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JvdXRlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndWknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBjb25zdCBpbmZvID0gYXNzZXRJbmZvLm5hbWU/LnNwbGl0KCcuJyk7XG4gICAgICAgICAgY29uc3QgZXh0ID0gaW5mbz8uW2luZm8ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKC9wbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY28vaS50ZXN0KGV4dCB8fCAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2ltYWdlcy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcbiAgICAgICAgICB9IGVsc2UgaWYgKC93b2ZmMj98dHRmfG90Znxlb3QvaS50ZXN0KGV4dCB8fCAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2ZvbnRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICAgIHRyZWVzaGFrZToge1xuICAgICAgICBtb2R1bGVTaWRlRWZmZWN0czogJ25vLWV4dGVybmFsJyxcbiAgICAgICAgcHJvcGVydHlSZWFkU2lkZUVmZmVjdHM6IGZhbHNlLFxuICAgICAgICB0cnlDYXRjaERlb3B0aW1pemF0aW9uOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnd291dGVyJywgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsICdsdWNpZGUtcmVhY3QnXSxcbiAgICBleGNsdWRlOiBbXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICB9XG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICBsb2dPdmVycmlkZTogeyAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCcgfVxuICB9LFxuICBqc29uOiB7XG4gICAgc3RyaW5naWZ5OiB0cnVlXG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUixTQUFTLG9CQUFvQjtBQUN2VCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8scUJBQXFCO0FBQzVCLFNBQVMsa0JBQWtCO0FBSjNCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUyxRQUFRLElBQUksWUFBWTtBQUFBLE1BQ2pDLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsU0FBUyxRQUFRLElBQUksWUFBWTtBQUFBLE1BQ2pDLFNBQVM7QUFBQSxNQUNULFdBQVc7QUFBQSxNQUNYLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELEdBQUksUUFBUSxJQUFJLFlBQVksU0FBUyxDQUFDLFdBQVc7QUFBQSxNQUMvQyxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDVDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osU0FBUyxDQUFDLHNCQUFzQixZQUFZO0FBQUEsSUFDOUM7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxNQUNULFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixPQUFPLENBQUMsSUFBSTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLEVBQUUsTUFBTSxLQUFLO0FBQUEsRUFDdEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLHVCQUF1QjtBQUFBLE1BQzFELFdBQVcsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxJQUNoRDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLHNCQUFzQjtBQUFBLElBQ3RCLHVCQUF1QjtBQUFBLElBQ3ZCLG1CQUFtQjtBQUFBLElBQ25CLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjLENBQUMsT0FBTztBQUNwQixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsZ0JBQUksR0FBRyxTQUFTLE9BQU8sS0FBSyxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQ3BELHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyx1QkFBdUIsR0FBRztBQUN4QyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsUUFBUSxHQUFHO0FBQ3pCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxPQUFPLFVBQVUsTUFBTSxNQUFNLEdBQUc7QUFDdEMsZ0JBQU0sTUFBTSxPQUFPLEtBQUssU0FBUyxDQUFDO0FBQ2xDLGNBQUksa0NBQWtDLEtBQUssT0FBTyxFQUFFLEdBQUc7QUFDckQsbUJBQU87QUFBQSxVQUNULFdBQVcsc0JBQXNCLEtBQUssT0FBTyxFQUFFLEdBQUc7QUFDaEQsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsbUJBQW1CO0FBQUEsUUFDbkIseUJBQXlCO0FBQUEsUUFDekIsd0JBQXdCO0FBQUEsTUFDMUI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsYUFBYSxVQUFVLHlCQUF5QixjQUFjO0FBQUEsSUFDakYsU0FBUyxDQUFDO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsYUFBYSxFQUFFLDRCQUE0QixTQUFTO0FBQUEsRUFDdEQ7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFdBQVc7QUFBQSxFQUNiO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
