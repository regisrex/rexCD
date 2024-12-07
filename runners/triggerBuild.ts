import { PrismaClient } from "@prisma/client";
import { runProject } from "./runProject";

const prisma = new PrismaClient();

const getApp = async (webhookId: string) => {
    const app = await prisma.app.findUnique({
        where: {
            webhookId
        }
    })
    if (!app) {
        throw new Error('App not found');
    }
    return runProject(app.id);
}
