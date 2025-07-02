#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const DEFAULT_CONFIG = {
    labs: [
        {
            name: "example-lab",
            notebookPath: "./notebooks/example.ipynb",
            port: 8888,
            workingDirectory: "./",
        },
    ],
    defaultPort: 8888,
    jupyterCommand: "jupyter notebook",
};
class JupyterLauncher {
    constructor(configPath = "./jupyter-launcher-config.json") {
        this.configPath = configPath;
        this.config = this.loadConfig();
    }
    loadConfig() {
        if (fs.existsSync(this.configPath)) {
            try {
                const configData = fs.readFileSync(this.configPath, "utf8");
                const parsedConfig = JSON.parse(configData);
                return { ...DEFAULT_CONFIG, ...parsedConfig };
            }
            catch (error) {
                console.error(`Error reading config file: ${error}`);
                console.log("Using default configuration...");
                return DEFAULT_CONFIG;
            }
        }
        else {
            console.log(`Config file not found at ${this.configPath}. Creating default config...`);
            this.createDefaultConfig();
            return DEFAULT_CONFIG;
        }
    }
    createDefaultConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
            console.log(`Default config created at ${this.configPath}`);
        }
        catch (error) {
            console.error(`Error creating config file: ${error}`);
        }
    }
    listLabs() {
        console.log("Available labs:");
        this.config.labs.forEach((lab, index) => {
            console.log(`  ${index + 1}. ${lab.name}`);
            console.log(`     Path: ${lab.notebookPath}`);
            console.log(`     Port: ${lab.port || this.config.defaultPort}`);
            if (lab.workingDirectory) {
                console.log(`     Working Directory: ${lab.workingDirectory}`);
            }
            console.log("");
        });
    }
    async launchLab(labName) {
        const lab = this.config.labs.find((l) => l.name === labName);
        if (!lab) {
            console.error(`Lab "${labName}" not found in configuration.`);
            console.log("Available labs:");
            this.config.labs.forEach((l) => console.log(`  - ${l.name}`));
            return;
        }
        const notebookFullPath = path.resolve(lab.notebookPath);
        const workingDir = lab.workingDirectory ? path.resolve(lab.workingDirectory) : path.dirname(notebookFullPath);
        const port = lab.port || this.config.defaultPort;
        console.log(`Launching Jupyter notebook for lab: ${lab.name}`);
        console.log(`Notebook path: ${notebookFullPath}`);
        console.log(`Working directory: ${workingDir}`);
        console.log(`Port: ${port}`);
        // Check if notebook file exists
        if (!fs.existsSync(notebookFullPath)) {
            console.error(`Notebook file not found: ${notebookFullPath}`);
            return;
        }
        // Check if working directory exists
        if (!fs.existsSync(workingDir)) {
            console.error(`Working directory not found: ${workingDir}`);
            return;
        }
        try {
            // Split the jupyter command properly for Windows
            const commandParts = this.config.jupyterCommand.split(" ");
            const command = commandParts[0]; // "jupyter"
            const subCommand = commandParts.slice(1); // ["notebook"]
            const args = [...subCommand, notebookFullPath, `--port=${port}`, "--no-browser", "--allow-root"];
            console.log(`Executing: ${command} ${args.join(" ")}`);
            console.log(`Working directory: ${workingDir}`);
            console.log("Press Ctrl+C to stop the Jupyter server\n");
            const jupyterProcess = (0, child_process_1.spawn)(command, args, {
                cwd: workingDir,
                stdio: "inherit",
                env: { ...process.env, ...lab.environment },
                shell: process.platform === "win32", // Use shell on Windows
            });
            jupyterProcess.on("error", (error) => {
                console.error(`Failed to start Jupyter: ${error.message}`);
                console.log("\nMake sure Jupyter is installed:");
                console.log("  pip install jupyter");
                console.log("  or");
                console.log("  conda install jupyter");
            });
            jupyterProcess.on("close", (code) => {
                console.log(`Jupyter process exited with code ${code}`);
            });
            // Handle graceful shutdown
            process.on("SIGINT", () => {
                console.log("\nShutting down Jupyter server...");
                jupyterProcess.kill("SIGINT");
                setTimeout(() => {
                    process.exit(0);
                }, 2000);
            });
        }
        catch (error) {
            console.error(`Error launching Jupyter: ${error}`);
        }
    }
    addLab(name, notebookPath, port, workingDirectory) {
        const newLab = {
            name,
            notebookPath,
            port,
            workingDirectory,
        };
        this.config.labs.push(newLab);
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            console.log(`Lab "${name}" added to configuration.`);
        }
        catch (error) {
            console.error(`Error saving config: ${error}`);
        }
    }
}
// CLI Setup
commander_1.program.name("tutors-jupyter-launcher").description("Launch Jupyter notebook instances for specific labs").version("1.0.0");
commander_1.program
    .command("list")
    .description("List all available labs")
    .action(() => {
    const launcher = new JupyterLauncher();
    launcher.listLabs();
});
commander_1.program
    .command("launch <labName>")
    .description("Launch a Jupyter notebook for the specified lab")
    .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
    .action((labName, options) => {
    const launcher = new JupyterLauncher(options.config);
    launcher.launchLab(labName);
});
commander_1.program
    .command("add <name> <notebookPath>")
    .description("Add a new lab to the configuration")
    .option("-p, --port <port>", "Port number for Jupyter server", parseInt)
    .option("-w, --workdir <path>", "Working directory for the notebook")
    .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
    .action((name, notebookPath, options) => {
    const launcher = new JupyterLauncher(options.config);
    launcher.addLab(name, notebookPath, options.port, options.workdir);
});
commander_1.program
    .command("init")
    .description("Initialize a default configuration file")
    .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
    .action((options) => {
    const launcher = new JupyterLauncher(options.config);
    console.log("Configuration initialized.");
});
// If no arguments provided, show help
if (process.argv.length <= 2) {
    commander_1.program.help();
}
commander_1.program.parse(process.argv);
//# sourceMappingURL=tutors-jupyter-launcher.js.map