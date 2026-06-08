import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const folders = ["Characters", "Monsters", "Weapons"];

  for (const folderName of folders) {
    const {
      rows: [folder],
    } = await db.query(
      `
      INSERT INTO folders (name)
      VALUES ($1)
      RETURNING *
      `,
      [folderName],
    );

    const files = [
      "placeholder-1",
      "placeholder-2",
      "placeholder-3",
      "placeholder-4",
      "placeholder-5",
    ];

    for (const fileName of files) {
      await db.query(
        `
        INSERT INTO files (name, size, folder_id)
        VALUES ($1, $2, $3)
        `,
        [fileName, 1000, folder.id],
      );
    }
  }
}
