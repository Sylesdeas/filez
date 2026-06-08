import db from "#db/client";

export async function getFolders() {
  const sql = `
  SELECT *
  FROM folders
  `;
  const { rows: folders } = await db.query(sql);
  return folders;
}

export async function getFolderById(id) {
  const sql = `
  SELECT *
  FROM folders
  WHERE id = $1
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}

export async function getFolderByIdIncludingFiles(id) {
  const sql = `
  SELECT
    folders.*,
    COALESCE(json_agg(files) FILTER (WHERE files.id IS NOT NULL), '[]') AS files
  FROM folders
  LEFT JOIN files ON folders.id = files.folder_id
  WHERE folders.id = $1
  GROUP BY folders.id
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}
