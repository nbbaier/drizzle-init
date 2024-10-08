import chalk from "chalk";
import fs from "fs";
import path from "path";

export const updateScripts = async () => {
	const packageJsonPath = path.join(process.cwd(), "package.json");

	fs.readFile(packageJsonPath, "utf8", async (err, data) => {
		if (err) {
			console.log(chalk.red("It looks like the package.json file is missing in the current directory."));
			console.log(chalk.green("To create a new package.json file, you can use the following command:"));
			console.log(chalk.green("npm init"));
			console.error(`Error reading package.json: ${err}`);
			return;
		}

		let packageJson;
		try {

			packageJson = JSON.parse(data);
		} catch (parseErr) {
			console.error(`Error parsing package.json: ${parseErr}`);
			return;
		}


		if (!packageJson.scripts) {
			packageJson.scripts = {};
		}


		packageJson.scripts["db:pull"] = "drizzle-kit introspect";
		packageJson.scripts["db:push"] = "drizzle-kit push";
		packageJson.scripts["db:migrate"] = "drizzle-kit migrate";
		packageJson.scripts["db:generate"] = "drizzle-kit generate";
		packageJson.scripts["db:drop"] = "drizzle-kit drop";
		packageJson.scripts["db:up"] = "drizzle-kit up";
		packageJson.scripts["db:check"] = "drizzle-kit check";
		packageJson.scripts["db:studio"] = "drizzle-kit studio";


		const updatedPackageJson = JSON.stringify(packageJson, null, 2);

		fs.writeFile(packageJsonPath, updatedPackageJson, "utf8", (writeErr) => {
			if (writeErr) {
				console.error(`Error writing package.json: ${writeErr}`);
			} else {
				console.log(chalk.green("Success! Your package.json file has been updated with the following scripts:"));
				console.log(chalk.blue("db:pull - Introspects the database schema."));
				console.log(chalk.blue("db:push - Pushes the latest changes to the database."));
				console.log(chalk.blue("db:migrate - Applies pending migrations to the database."));
				console.log(chalk.blue("db:generate - Generates code based on the current database schema."));
				console.log(chalk.blue("db:drop - Drops the entire database schema."));
				console.log(chalk.blue("db:up - Brings up the database to the latest version."));
				console.log(chalk.blue("db:check - Checks the current database schema against the code."));
				console.log(chalk.blue("db:studio - Opens a database management studio for visual interaction."));
			}
		});
	});
};

