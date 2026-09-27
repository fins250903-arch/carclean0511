import path from 'node:path';

const PUBLIC_DIRS = ['src', 'public', 'dist'];

export function assertInternalOutput(outPath, root) {
  const resolved = path.resolve(outPath);
  for (const dirName of PUBLIC_DIRS) {
    const blocked = path.resolve(root, dirName);
    if (resolved === blocked || resolved.startsWith(`${blocked}${path.sep}`)) {
      throw new Error(`Refusing to write internal PDCA output into ${dirName}/`);
    }
  }
  return resolved;
}
