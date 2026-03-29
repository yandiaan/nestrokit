/**
 * Update Configs Action
 *
 * Updates turbo.json, root package.json, and other configs
 * after removing apps/packages.
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();

export async function updateConfigs(
  removedApps: string[],
  removedPackages: string[],
  dryRun: boolean,
): Promise<void> {
  // Update root package.json scripts
  await updateRootPackageJson(removedApps, dryRun);

  // Update turbo.json
  await updateTurboJson(removedApps, removedPackages, dryRun);

  // Update docker-compose files
  await updateDockerCompose(removedApps, dryRun);
}

async function updateRootPackageJson(removedApps: string[], dryRun: boolean): Promise<void> {
  const pkgPath = join(ROOT_DIR, 'package.json');

  if (!existsSync(pkgPath)) return;

  const content = await readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(content);

  if (!pkg.scripts) return;

  // Build mapping of apps to their script patterns
  const appPatterns: Record<string, RegExp[]> = {
    api: [/api|backend|server/i],
    web: [/web|frontend|client/i],
  };

  // Remove scripts that reference removed apps
  for (const app of removedApps) {
    const patterns = appPatterns[app] || [];
    for (const [name, script] of Object.entries(pkg.scripts)) {
      for (const pattern of patterns) {
        if (pattern.test(name) || (typeof script === 'string' && pattern.test(script))) {
          if (dryRun) {
            console.log(`  [DRY RUN] Would remove script: ${name}`);
          } else {
            delete pkg.scripts[name];
          }
        }
      }
    }
  }

  if (!dryRun) {
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('  Updated: package.json');
  }
}

async function updateTurboJson(
  removedApps: string[],
  removedPackages: string[],
  dryRun: boolean,
): Promise<void> {
  const turboPath = join(ROOT_DIR, 'turbo.json');

  if (!existsSync(turboPath)) return;

  const content = await readFile(turboPath, 'utf-8');
  const turbo = JSON.parse(content);

  // Note: turbo.json typically doesn't need modification
  // as it uses glob patterns that handle missing packages gracefully

  if (dryRun) {
    console.log('  [DRY RUN] Would update: turbo.json (no changes needed)');
  } else {
    console.log('  Checked: turbo.json (no changes needed)');
  }
}

async function updateDockerCompose(removedApps: string[], dryRun: boolean): Promise<void> {
  const composePath = join(ROOT_DIR, 'docker-compose.prod.yml');

  if (!existsSync(composePath)) return;

  let content = await readFile(composePath, 'utf-8');

  // Simple approach: comment out removed service blocks
  for (const app of removedApps) {
    const serviceRegex = new RegExp(`(^  ${app}:$[\\s\\S]*?(?=^  \\w+:|^volumes:|^networks:|$))`, 'gm');

    if (dryRun) {
      console.log(`  [DRY RUN] Would comment out service: ${app} in docker-compose.prod.yml`);
    } else {
      content = content.replace(serviceRegex, (match) => {
        return match.split('\n').map((line) => `# ${line}`).join('\n');
      });
    }
  }

  if (!dryRun && removedApps.length > 0) {
    await writeFile(composePath, content);
    console.log('  Updated: docker-compose.prod.yml');
  }
}
