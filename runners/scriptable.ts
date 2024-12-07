import { execSync } from 'child_process';
export class Scriptable {
    stdin: any;
    stdout: any;
    stderr: any;

    constructor() {
        this.stdin = process.stdin;
        this.stdout = process.stdout;
        this.stderr = process.stderr;
    }

    runCommand(hookScript) {
        return () => {
            console.log(`Running script: ${hookScript}`);
            return execSync(hookScript, { stdio: [this.stdin, this.stdout, this.stderr] });
        }
    }
}