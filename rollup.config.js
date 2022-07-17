import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import getPath from "platform-folders";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";


// Environment variables
const build = process.env.BUILD || "development";
const isDevelop = (build === "development");

const plugin_file = `${pkg.name}.js`;
const developOutput = `${getPath("documents")}/OpenRCT2/plugin/${plugin_file}`;
const releaseOutput = `./dist/${plugin_file}`;

const output = (isDevelop) ? developOutput : releaseOutput;


/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "./src/registerPlugin.ts",
  output: {
    file: output,
    format: "iife",
  },
  plugins: [
    replace({
      include: "./src/environment.ts",
      preventAssignment: true,
      values: {
        __PLUGIN_NAME__: pkg.name,
        __PLUGIN_VERSION__: pkg.version,
        __BUILD_CONFIGURATION__: build
      }
    }),
    typescript(),
    terser({
      compress: {
        passes: 5
      },
      format: {
        comments: false,
        quote_style: 1,
        wrap_iife: true,
        // preamble: "// Get the latest version: https://github.com/Basssiiie/OpenRCT2-ProxyPather",
        beautify: isDevelop,
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      // Useful only for stacktraces:
      keep_fnames: isDevelop,
    }),
  ],
};
export default config;