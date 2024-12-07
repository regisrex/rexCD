import { PrismaClient } from "@prisma/client";
import express from "express";
import { appSchema, envSchema } from "../utils/validators";

const prisma = new PrismaClient();
const restApi = express();

restApi.use(express.json());


// Get All Apps
restApi.get("/apps", async (req, res) => {
    const apps = await prisma.app.findMany();
    res.json(apps);
});



// Delete App
restApi.delete("/apps/:id", async (req, res) => {
    try {
        await prisma.app.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// === Env Routes ===

// Create Env
restApi.post("/envs", async (req, res) => {
    try {
        const validatedData = envSchema.parse(req.body);
        const newEnv = await prisma.env.create({
            data: {
                appId: validatedData.appId,
                content: validatedData.content,
                filename: validatedData.filename,
                path: validatedData.path,
                apps: { connect: { id: validatedData.appId } },

            }
        });
        res.json(newEnv);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Envs
restApi.get("/envs", async (req, res) => {
    const envs = await prisma.env.findMany();
    res.json(envs);
});

restApi.post('/apps/:hookId/github-webhook', async (req, res) => {
    const { hookId } = req.params;
    const { body } = req;
    console.log('Received webhook for project', hookId);
    console.log('Webhook body:', body);
    res.send('Webhook received');
})

// // Create App
restApi.post("/apps", async (req, res) => {
    try {
        const validatedData = appSchema.parse(req.body);
        const newApp = await prisma.app.create({
            data: {
                branch: validatedData.branch,
                githubToken: validatedData.githubToken,
                name: validatedData.name,
                commands: validatedData.commands,
                repository: validatedData.repository,
                status: "SLEEPING",
                webhookId: validatedData.webhookId,
                workDir: validatedData.workDir,
            }
        });
        res.json(newApp);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Env
restApi.delete("/envs/:id", async (req, res) => {
    try {
        await prisma.env.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


export default restApi;