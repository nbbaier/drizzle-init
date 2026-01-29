import fs from 'fs';
import path from 'path';

interface VersionInfo {
    version: string;
    desc: string;
}

export const getVersion = async (): Promise<VersionInfo> => {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    return new Promise((resolve, reject) => {
        fs.readFile(packageJsonPath, "utf8", (err, data) => {
            if (err) {
                return reject(err);
            }

            try {
                const packageJson = JSON.parse(data);
                const version: string = packageJson.version;
                const desc: string = packageJson.description;

                resolve({ version, desc });
            } catch (parseErr) {
                reject(parseErr);
            }
        });
    });
};
