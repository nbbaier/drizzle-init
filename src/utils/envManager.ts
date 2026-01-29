import fs from 'fs';
import chalk from 'chalk';
import { safeWriteFile } from './fileSystem.js';

export const getEnvVarsForProvider = (provider: string): string[] => {
    switch (provider) {
        case 'Turso':
            return ['DATABASE_URL', 'DATABASE_AUTH_TOKEN'];
        case 'Cloudflare D1':
            return ['DATABASE_ACCOUNT_ID', 'DATABASE_ID', 'DATABASE_TOKEN'];
        case 'AWS Data API':
            return ['DATABASE', 'RESOURCE_ARN', 'SECRET_ARN'];
        default:
            return ['DATABASE_URL'];
    }
};

export const createEnvFile = async (provider: string): Promise<void> => {
    const vars = getEnvVarsForProvider(provider);
    const content = vars.map(v => `${v}=YOUR_${v}_HERE`).join('\n');

    const written = await safeWriteFile('.env', content);
    if (written) {
        console.log(chalk.green('.env file created successfully.'));
    }
};

export const updateGitignore = async (): Promise<void> => {
    const gitignorePath = '.gitignore';

    if (fs.existsSync(gitignorePath)) {
        const content = fs.readFileSync(gitignorePath, 'utf8');
        if (!content.includes('.env')) {
            fs.appendFileSync(gitignorePath, '\n.env\n');
            console.log(chalk.green('Added .env to .gitignore'));
        }
    } else {
        await safeWriteFile(gitignorePath, '.env\nnode_modules\n');
        console.log(chalk.green('Created .gitignore with .env'));
    }
};
