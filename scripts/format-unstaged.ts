// Format unstaged changes without ever adding them to a commit.
const diff = Bun.spawnSync(
  ['git', 'diff', '--name-only', '-z', '--diff-filter=ACMRT'],
  { stdout: 'pipe', stderr: 'inherit' },
);
if (diff.exitCode !== 0) process.exit(diff.exitCode);

const files = new TextDecoder()
  .decode(diff.stdout)
  .split('\0')
  .filter((path) => /\.(?:js|jsx|ts|tsx|json|jsonc|css|md)$/.test(path));

for (let index = 0; index < files.length; index += 50) {
  const batch = files.slice(index, index + 50);
  const result = Bun.spawnSync(
    [
      process.execPath,
      'x',
      'biome',
      'format',
      '--write',
      '--no-errors-on-unmatched',
      '--',
      ...batch,
    ],
    { stdout: 'inherit', stderr: 'inherit' },
  );
  if (result.exitCode !== 0) process.exit(result.exitCode);
}
