/**
 * Scaffold CLI
 *
 * Interactive CLI for customizing the boilerplate.
 * Allows removing unused apps/packages based on project needs.
 */

import * as p from '@clack/prompts';
import pc from 'picocolors';
import { removeApps } from './actions/remove-apps.js';
import { removePackages } from './actions/remove-packages.js';
import { updateConfigs } from './actions/update-configs.js';
import { cleanupDeps } from './actions/cleanup-deps.js';

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.clear();

  p.intro(pc.bgCyan(pc.black(' Nestrokit Scaffold CLI ')));

  if (isDryRun) {
    p.note('Running in dry-run mode. No files will be modified.');
  }

  const projectType = await p.select({
    message: 'What type of project are you building?',
    options: [
      { value: 'fullstack', label: 'Full-stack (Frontend + Backend)', hint: 'Keep everything' },
      { value: 'frontend', label: 'Frontend only', hint: 'Remove API, database' },
      { value: 'backend', label: 'Backend only', hint: 'Remove web app' },
      { value: 'custom', label: 'Custom selection', hint: 'Choose what to keep' },
    ],
  });

  if (p.isCancel(projectType)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let appsToRemove: string[] = [];
  let packagesToRemove: string[] = [];

  if (projectType === 'frontend') {
    appsToRemove = ['api'];
    packagesToRemove = ['database'];
  } else if (projectType === 'backend') {
    appsToRemove = ['web'];
    packagesToRemove = ['ui', 'api-client'];
  } else if (projectType === 'custom') {
    const selectedApps = await p.multiselect({
      message: 'Which apps do you want to REMOVE?',
      options: [
        { value: 'api', label: 'Backend API (apps/api)', hint: 'NestJS API server' },
        { value: 'web', label: 'Frontend Web (apps/web)', hint: 'Astro + Svelte frontend' },
      ],
      required: false,
    });

    if (p.isCancel(selectedApps)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    appsToRemove = selectedApps as string[];

    const selectedPackages = await p.multiselect({
      message: 'Which packages do you want to REMOVE?',
      options: [
        { value: 'database', label: '@repo/database', hint: 'Prisma + PostgreSQL' },
        { value: 'ui', label: '@repo/ui', hint: 'Svelte UI components' },
        { value: 'api-client', label: '@repo/api-client', hint: 'Generated API client' },
      ],
      required: false,
    });

    if (p.isCancel(selectedPackages)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    packagesToRemove = selectedPackages as string[];
  }

  // Confirm before proceeding
  if (appsToRemove.length > 0 || packagesToRemove.length > 0) {
    const message = [
      'The following will be removed:',
      ...appsToRemove.map((a) => `  - apps/${a}`),
      ...packagesToRemove.map((p) => `  - packages/${p}`),
    ].join('\n');

    p.note(message, 'Summary');

    const confirmed = await p.confirm({
      message: 'Proceed with removal?',
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
  }

  const spinner = p.spinner();

  // Remove apps
  if (appsToRemove.length > 0) {
    spinner.start('Removing apps...');
    await removeApps(appsToRemove, isDryRun);
    spinner.stop('Apps removed');
  }

  // Remove packages
  if (packagesToRemove.length > 0) {
    spinner.start('Removing packages...');
    await removePackages(packagesToRemove, isDryRun);
    spinner.stop('Packages removed');
  }

  // Update turbo.json and other configs
  spinner.start('Updating configurations...');
  await updateConfigs(appsToRemove, packagesToRemove, isDryRun);
  spinner.stop('Configurations updated');

  // Cleanup dependencies
  spinner.start('Cleaning up dependencies...');
  await cleanupDeps(isDryRun);
  spinner.stop('Dependencies cleaned');

  p.outro(pc.green('✓ Scaffold complete! Run `pnpm install` to update dependencies.'));
}

main().catch((error) => {
  console.error(pc.red('Error:'), error);
  process.exit(1);
});
