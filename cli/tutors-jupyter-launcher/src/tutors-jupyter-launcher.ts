#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { exec, spawn, ChildProcess } from "child_process";
import { program } from "commander";

interface LabConfig {
  name: string;
  notebookPath: string;
  port?: number;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

interface Config {
  labs: LabConfig[];
  defaultPort: number;
  jupyterCommand: string;
}

const DEFAULT_CONFIG: Config = {
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
  private config: Config;
  private configPath: string;

  constructor(configPath: string = "./jupyter-launcher-config.json") {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    if (fs.existsSync(this.configPath)) {
      try {
        const configData = fs.readFileSync(this.configPath, "utf8");
        const parsedConfig = JSON.parse(configData) as Partial<Config>;
        return { ...DEFAULT_CONFIG, ...parsedConfig };
      } catch (error) {
        console.error(`Error reading config file: ${error}`);
        console.log("Using default configuration...");
        return DEFAULT_CONFIG;
      }
    } else {
      console.log(`Config file not found at ${this.configPath}. Creating default config...`);
      this.createDefaultConfig();
      return DEFAULT_CONFIG;
    }
  }

  private createDefaultConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
      console.log(`Default config created at ${this.configPath}`);
    } catch (error) {
      console.error(`Error creating config file: ${error}`);
    }
  }

  public listLabs(): void {
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

  public async launchLab(labName: string): Promise<void> {
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

      const jupyterProcess = spawn(command, args, {
        cwd: workingDir,
        stdio: "inherit",
        env: { ...process.env, ...lab.environment },
        shell: process.platform === "win32", // Use shell on Windows
      });

      jupyterProcess.on("error", (error: Error) => {
        console.error(`Failed to start Jupyter: ${error.message}`);
        console.log("\nMake sure Jupyter is installed:");
        console.log("  pip install jupyter");
        console.log("  or");
        console.log("  conda install jupyter");
      });

      jupyterProcess.on("close", (code: number | null) => {
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
    } catch (error) {
      console.error(`Error launching Jupyter: ${error}`);
    }
  }

  public addLab(name: string, notebookPath: string, port?: number, workingDirectory?: string): void {
    const newLab: LabConfig = {
      name,
      notebookPath,
      port,
      workingDirectory,
    };

    this.config.labs.push(newLab);

    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log(`Lab "${name}" added to configuration.`);
    } catch (error) {
      console.error(`Error saving config: ${error}`);
    }
  }
}

// CLI Setup
program.name("tutors-jupyter-launcher").description("Launch Jupyter notebook instances for specific labs").version("1.0.0");

program
  .command("list")
  .description("List all available labs")
  .action(() => {
    const launcher = new JupyterLauncher();
    launcher.listLabs();
  });

program
  .command("launch <labName>")
  .description("Launch a Jupyter notebook for the specified lab")
  .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
  .action((labName: string, options: { config?: string }) => {
    const launcher = new JupyterLauncher(options.config);
    launcher.launchLab(labName);
  });

program
  .command("add <name> <notebookPath>")
  .description("Add a new lab to the configuration")
  .option("-p, --port <port>", "Port number for Jupyter server", parseInt)
  .option("-w, --workdir <path>", "Working directory for the notebook")
  .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
  .action((name: string, notebookPath: string, options: { port?: number; workdir?: string; config?: string }) => {
    const launcher = new JupyterLauncher(options.config);
    launcher.addLab(name, notebookPath, options.port, options.workdir);
  });

program
  .command("init")
  .description("Initialize a default configuration file")
  .option("-c, --config <path>", "Path to config file", "./jupyter-launcher-config.json")
  .action((options: { config?: string }) => {
    const launcher = new JupyterLauncher(options.config);
    console.log("Configuration initialized.");
  });

// If no arguments provided, show help
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
