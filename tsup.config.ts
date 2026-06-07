import { defineConfig } from "tsup";

export default defineConfig({
  // Do alag entry points: Ek backend core ke liye, ek React components ke liye
  entry: ["src/index.ts", "src/react.tsx"],
  format: ["cjs", "esm"],      // Dono formats generate honge (.js aur .mjs)
  dts: true,                   // Auto-generate TypeScript .d.ts files
  splitting: false,
  sourcemap: true,
  clean: true,                 // Har baar purana build delete karega
  minify: true,                // Code compressed aur fast hoga
  external: ["react", "react-dom"], // Inhe bundle nahi karna, user ke app se uthayega
});