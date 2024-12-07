import { PrismaClient } from "@prisma/client";
import { exec, execSync } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { env } from "../utils/env";
import { Scriptable } from "./scriptable";

config();

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const runner = new Scriptable();


export async function runProject(appId: string) {

    try {
        const app = await prisma.app.findUnique({
            where: { id: appId },
            include: { envs: true },
        });

        if (!app) {
            throw new Error(`App with id ${appId} not found.`);
        }
        const projectDir = `${env.REXCD_HOME}/${appId}`;
        const gitUrlWithToken = app.repository.replace(
            "https://",
            `https://${app.githubToken}@`
        );

        if (!fs.existsSync(projectDir)) {
            console.log(`Cloning repository: ${app.repository} (branch: ${app.branch})`);
            execSync(
                `git clone --branch ${app.branch} ${gitUrlWithToken} ${projectDir}`,
                { stdio: "inherit" }
            );
        } else {
            console.log(`Pulling latest changes for branch: ${app.branch}...`);
            execSync(`git fetch`, { cwd: projectDir, stdio: "inherit" });
            execSync(`git checkout ${app.branch}`, { cwd: projectDir, stdio: "inherit" });
            execSync(`git pull origin ${app.branch}`, { cwd: projectDir, stdio: "inherit" });
        }

        for (const env of app.envs) {
            const envFilePath = path.join(projectDir, env.filename);
            fs.writeFileSync(envFilePath, env.content, "utf-8");
        }

        const logFile = path.join(projectDir, "logs.txt");
        const logStream = fs.createWriteStream(logFile, { flags: "a" });

        const commands = app.commands.split(",");
        for (const command of commands) {
            console.log(`Running command: ${command}`);
            logStream.write(`\nRunning command: ${command}\n`);
            try {
                const run = runner.runCommand(command);
                run();

            } catch (error) {
                logStream.write(
                    `Error running command: ${command}\n${error.message}\n`
                );
                throw error;
            }
        }


        console.log(`Project ${appId} commands executed successfully.`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        prisma.$disconnect();
    }
}

