import fs from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { promptConfirm } from './prompts.js';

const runCommand = (command: string, args: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit', shell: true });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
        child.on('error', (err) => {
            reject(err);
        });
    });
};

export const detectPackageManager = (): string => {
    if (fs.existsSync('yarn.lock')) return 'yarn';
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('bun.lockb')) return 'bun';
    return 'npm';
};

const getDependencies = (db: string, provider: string): { deps: string[]; devDeps: string[] } => {
    const deps = ['drizzle-orm'];
    const devDeps = ['drizzle-kit'];

    if (db === 'PostgreSQL') {
        if (provider === 'Neon') deps.push('@neondatabase/serverless');
        if (provider === 'Xata') deps.push('@xata.io/client');
        if (provider === 'PostgresJS' || provider === 'Supabase') deps.push('postgres');
        if (provider === 'node-postgres' || provider === 'Cloudflare') { deps.push('pg'); devDeps.push('@types/pg'); }
        if (provider === 'PGlite') deps.push('@electric-sql/pglite');
        if (provider === 'Vercel Postgres') deps.push('@vercel/postgres');
        if (provider === 'AWS Data API') deps.push('@aws-sdk/client-rds-data', '@aws-sdk/credential-providers');
        if (provider === 'HTTP Proxy') deps.push('axios');
    } else if (db === 'MySQL') {
        if (provider === 'planetScale') deps.push('@planetscale/database');
        if (provider === 'Mysql2') deps.push('mysql2');
        if (provider === 'TiDB Serverless') deps.push('@tidbcloud/serverless');
        if (provider === 'HTTP proxy') deps.push('axios');
    } else if (db === 'SQLite') {
        if (provider === 'Turso') deps.push('@libsql/client');
        // Bun sqlite is built-in
        if (provider === 'React Native SQLite' || provider === 'Expo SQLite') deps.push('expo-sqlite');
        if (provider === 'better-sqlite3') deps.push('better-sqlite3');
        if (provider === 'HTTP Proxy') deps.push('axios');
    }

    return { deps, devDeps };
};

export const installDependencies = async (db: string, provider: string): Promise<void> => {
    const { deps, devDeps } = getDependencies(db, provider);
    const pm = detectPackageManager();

    console.log(chalk.blue(`Detected package manager: ${pm}`));
    console.log(`Dependencies to install: ${chalk.cyan(deps.join(', '))}`);
    console.log(`Dev Dependencies to install: ${chalk.cyan(devDeps.join(', '))}`);

    const install = await promptConfirm(
        'Do you want to install these dependencies now?',
        true
    );

    if (!install) return;

    const installCmd = pm === 'npm' ? 'install' : 'add';
    const devFlag = pm === 'npm' ? '--save-dev' : (pm === 'bun' ? '-d' : '-D');

    try {
        console.log(chalk.yellow('Installing dependencies...'));
        if (deps.length > 0) {
            await runCommand(pm, [installCmd, ...deps]);
        }

        console.log(chalk.yellow('Installing dev dependencies...'));
        if (devDeps.length > 0) {
            await runCommand(pm, [installCmd, devFlag, ...devDeps]);
        }

        console.log(chalk.green('Dependencies installed successfully!'));
    } catch (error: any) {
        console.error(chalk.red('Error installing dependencies:'), error.message);
    }
};
