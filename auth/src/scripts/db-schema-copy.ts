import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseDir = resolve(__dirname, "../../../meet_n_link");

// directories relative to auth
const targets = ["logistics", "normal", "seller"];

console.log(`🔍 Running introspect in ${baseDir}...`);

try {
  execSync(`npx drizzle-kit introspect`, {
    cwd: baseDir,
    stdio: "inherit",
  });
} catch (err) {
  console.error(`❌ Failed to introspect in ${baseDir}`);
  console.error(err.message);
}

console.log("✅ All introspections complete!");
