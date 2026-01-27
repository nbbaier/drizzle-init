import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const checkFileExists = (filepath) => {
    return fs.existsSync(filepath);
};

export const safeWriteFile = async (filepath, content) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (checkFileExists(filepath)) {
        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `File ${chalk.cyan(filepath)} already exists. Overwrite?`,
                default: false,
            },
        ]);

        if (!answer.overwrite) {
            console.log(chalk.yellow(`Skipped ${filepath}`));
            return false;
        }
    }

    fs.writeFileSync(filepath, content, 'utf8');
    return true;
};
