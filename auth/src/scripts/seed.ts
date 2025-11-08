async function main() {}

async function seed() {
  console.log("DB Seeded:");
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
