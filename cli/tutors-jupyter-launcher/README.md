# Tutors Jupyter Launcher

A CLI tool to launch Jupyter notebook instances for specific labs with configurable settings.

## Installation

```bash
npm install
npm run build
npm link  # To make it globally available
```

## Usage

### Initialize Configuration

Create a default configuration file:

```bash
tutors-jupyter-launcher init
```

This creates a `jupyter-launcher-config.json` file with default settings.

### List Available Labs

```bash
tutors-jupyter-launcher list
```

### Launch a Lab

```bash
tutors-jupyter-launcher launch <lab-name>
```

### Add a New Lab

```bash
tutors-jupyter-launcher add <name> <notebook-path> [options]
```

Options:

- `-p, --port <port>`: Port number for Jupyter server
- `-w, --workdir <path>`: Working directory for the notebook
- `-c, --config <path>`: Path to config file (default: ./jupyter-launcher-config.json)

## Configuration

The configuration file (`jupyter-launcher-config.json`) structure:

```json
{
  "labs": [
    {
      "name": "example-lab",
      "notebookPath": "./notebooks/example.ipynb",
      "port": 8888,
      "workingDirectory": "./",
      "environment": {
        "CUSTOM_VAR": "value"
      }
    }
  ],
  "defaultPort": 8888,
  "jupyterCommand": "jupyter notebook"
}
```

### Configuration Options

- `labs`: Array of lab configurations
  - `name`: Unique identifier for the lab
  - `notebookPath`: Path to the Jupyter notebook file
  - `port`: (Optional) Port number for the Jupyter server
  - `workingDirectory`: (Optional) Working directory when launching Jupyter
  - `environment`: (Optional) Environment variables to set
- `defaultPort`: Default port to use if not specified for a lab
- `jupyterCommand`: Command to run Jupyter (default: "jupyter notebook")

## Examples

### Basic Usage

```bash
# Initialize config
tutors-jupyter-launcher init

# List available labs
tutors-jupyter-launcher list

# Launch various Hello World labs
tutors-jupyter-launcher launch java-hello-world
tutors-jupyter-launcher launch python-hello-world
tutors-jupyter-launcher launch go-hello-world

# Add a new lab
tutors-jupyter-launcher add data-analysis ./notebooks/data-analysis.ipynb -p 8889
```

### Advanced Configuration

Edit the `jupyter-launcher-config.json` file manually for advanced settings:

```json
{
  "labs": [
    {
      "name": "ml-basics",
      "notebookPath": "./labs/ml-basics/notebook.ipynb",
      "port": 8888,
      "workingDirectory": "./labs/ml-basics",
      "environment": {
        "PYTHONPATH": "./libs",
        "DATA_DIR": "./data"
      }
    },
    {
      "name": "web-scraping",
      "notebookPath": "./labs/web-scraping/scraper.ipynb",
      "port": 8889,
      "workingDirectory": "./labs/web-scraping"
    }
  ],
  "defaultPort": 8888,
  "jupyterCommand": "jupyter lab"
}
```

## Requirements

- Node.js
- TypeScript
- Jupyter (install with `pip install jupyter` or `conda install jupyter`)

## Hello World Labs

This package includes complete "Hello World" lab notebooks for multiple programming languages that demonstrate:

### Java Hello World Lab

- Basic Java syntax and structure
- Variable declarations and data types
- Arithmetic operations
- Method creation and calling
- Interactive Java programming in Jupyter

### Python Hello World Lab

- Basic Python syntax and dynamic typing
- Variable declarations and built-in types
- Arithmetic operations and string manipulation
- Function definitions and list comprehensions
- Interactive Python programming in Jupyter

### Go Hello World Lab

- Basic Go syntax and static typing
- Variable declarations and type inference
- Arithmetic operations and string manipulation
- Function definitions with error handling
- Working with slices and interactive Go programming in Jupyter

### Prerequisites for Java Notebooks

Before running Java notebooks, ensure you have:

1. **Java Development Kit (JDK)** installed:

   ```bash
   # Windows (using Chocolatey)
   choco install openjdk11

   # Or download from Oracle/OpenJDK websites
   ```

2. **IJava Kernel** for Jupyter:

   ```bash
   # Using Conda (recommended)
   conda install -c conda-forge ijava

   # Or manually install from:
   # https://github.com/SpencerPark/IJava
   ```

3. **Jupyter Notebook or JupyterLab**:
   ```bash
   pip install jupyter
   # or
   conda install jupyter
   ```

### Prerequisites for Python Notebooks

Before running Python notebooks, ensure you have:

1. **Python 3.x** installed:

   ```bash
   # Windows (using Chocolatey)
   choco install python

   # Or download from python.org
   ```

2. **Jupyter Notebook or JupyterLab**:
   ```bash
   pip install jupyter
   # or
   conda install jupyter
   ```

### Prerequisites for Go Notebooks

Before running Go notebooks, ensure you have:

1. **Go 1.18+** installed:

   ```bash
   # Windows (using Chocolatey)
   choco install golang

   # Or download from golang.org
   ```

2. **Gophernotes Kernel** for Jupyter:

   ```bash
   go install github.com/gopherdata/gophernotes@latest

   # Then register the kernel
   mkdir -p ~/.local/share/jupyter/kernels/gophernotes
   cd ~/.local/share/jupyter/kernels/gophernotes
   wget https://raw.githubusercontent.com/gopherdata/gophernotes/master/kernel/kernel.json
   ```

3. **Jupyter Notebook or JupyterLab**:
   ```bash
   pip install jupyter
   # or
   conda install jupyter
   ```

### Quick Start with Hello World Labs

1. **Setup the tool**:

   ```bash
   cd cli/tutors-jupyter-launcher
   npm install
   npm run build
   ```

2. **Initialize configuration**:

   ```bash
   npm run start -- init
   ```

3. **List available labs**:

   ```bash
   npm run start -- list
   ```

   You should see:

   ```
   Available labs:
   1. java-hello-world
      Path: ./notebooks/java-hello-world.ipynb
      Port: 8888
      Working Directory: ./notebooks

   2. python-hello-world
      Path: ./notebooks/python-hello-world.ipynb
      Port: 8889
      Working Directory: ./notebooks

   3. go-hello-world
      Path: ./notebooks/go-hello-world.ipynb
      Port: 8890
      Working Directory: ./notebooks
   ```

4. **Launch a lab**:

   ```bash
   # Launch Java lab
   npm run start -- launch java-hello-world

   # Launch Python lab
   npm run start -- launch python-hello-world

   # Launch Go lab
   npm run start -- launch go-hello-world
   ```

5. **Open in browser**: Jupyter will start and open automatically, or visit the appropriate port:

   - Java: `http://localhost:8888`
   - Python: `http://localhost:8889`
   - Go: `http://localhost:8890`

6. **Run the notebook**: Execute each cell to see code in action!

### What You'll Learn

The Hello World labs cover:

**Java Lab:**

- Writing your first Java program
- Understanding Java data types (int, double, String, boolean, char)
- Performing basic calculations
- Creating and using methods
- Building a simple calculator

**Python Lab:**

- Writing your first Python program
- Understanding Python's dynamic typing
- Working with built-in data types
- String formatting and manipulation
- Creating functions and working with lists
- List comprehensions

**Go Lab:**

- Writing your first Go program
- Understanding Go's static typing with type inference
- Variable declarations and basic operations
- String manipulation with the strings package
- Creating functions with error handling
- Working with slices and range loops

### Troubleshooting Setup

**If Java kernel is not available:**

1. Verify JDK installation: `java -version`
2. Install IJava kernel following the [official guide](https://github.com/SpencerPark/IJava)
3. Restart Jupyter after installing IJava

**If Python kernel is not available:**

1. Verify Python installation: `python --version` or `python3 --version`
2. Ensure Jupyter is installed: `pip install jupyter`
3. Restart Jupyter if needed

**If Go kernel is not available:**

1. Verify Go installation: `go version`
2. Install gophernotes kernel: `go install github.com/gopherdata/gophernotes@latest`
3. Register the kernel following the [gophernotes setup guide](https://github.com/gopherdata/gophernotes)
4. Restart Jupyter after installing gophernotes

**If notebooks don't launch:**

1. Check that Jupyter is installed: `jupyter --version`
2. Verify the notebook file exists in the notebooks directory
3. Try launching Jupyter manually: `jupyter notebook`
4. Check that the required language runtime is installed

## Development

```bash
npm install
npm run build
npm run start -- [command] [args]
```
