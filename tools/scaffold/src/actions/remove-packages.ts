/**
 * Remove Packages Action
 *
 * Removes specified package directories and their references.
 */

import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();

export async function removePackages(packages: string[], dryRun: boolean): Promise<void> {
  for (const pkg of packages) {
    const pkgPath = join(ROOT_DIR, 'packages', pkg);

    if (!existsSync(pkgPath)) {
      console.log(`  Skipping packages/${pkg} (not found)`);
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would remove: packages/${pkg}`);
    } else {
      await rm(pkgPath, { recursive: true, force: true });
      console.log(`  Removed: packages/${pkg}`);
    }
  }
}
