import z from 'zod';

const envParser = z.object({
    REXCD_HOME: z.string(),
    DATABASE_URL: z.string(),
});

export const env = envParser.parse(process.env);
