import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseDir = resolve(__dirname, "../../../");

// directories relative to auth
const targets = ["logistics", "normal","seller"];

for (const dir of targets) {
  const targetPath = resolve(baseDir, dir);
  console.log(`🔍 Running introspect in ${targetPath}...`);

  try {
    execSync(`npx drizzle-kit introspect`, {
      cwd: targetPath,
      stdio: "inherit",
    });
  } catch (err) {
    console.error(`❌ Failed to introspect in ${targetPath}`);
    console.error(err.message);
  }
}

console.log("✅ All introspections complete!");
