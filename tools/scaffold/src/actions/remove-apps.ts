/**
 * Remove Apps Action
 *
 * Removes specified app directories and their references.
 */

import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();

export async function removeApps(apps: string[], dryRun: boolean): Promise<void> {
  for (const app of apps) {
    const appPath = join(ROOT_DIR, 'apps', app);

    if (!existsSync(appPath)) {
      console.log(`  Skipping apps/${app} (not found)`);
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would remove: apps/${app}`);
    } else {
      await rm(appPath, { recursive: true, force: true });
      console.log(`  Removed: apps/${app}`);
    }
  }
}
