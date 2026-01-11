# Command Line Interface

ESLint provides a comprehensive command-line interface for linting JavaScript files and projects. The CLI supports numerous options for configuration, output formatting, and behavior customization.

## Capabilities

### Basic Usage

```bash { .api }
# Lint specific files
eslint file1.js file2.js

# Lint with glob patterns
eslint "src/**/*.js"

# Lint and fix issues automatically
eslint --fix "src/**/*.js"

# Use specific configuration file
eslint --config .eslintrc.json "src/**/*.js"
```

### Core Options

Configuration and behavior control options.

```bash { .api }
# Configuration
--config <path>          # Use specific config file
--no-config-lookup      # Disable config file discovery
--env <environment>     # Enable specific environments

# File Discovery
--ext <extensions>      # Specify file extensions (default: .js)
--ignore-path <path>    # Use specific ignore file
--no-ignore            # Disable .eslintignore and ignore patterns

# Output Control
--format <formatter>    # Output format (default: stylish)
--output-file <path>    # Write output to file instead of stdout
--quiet                # Report errors only (no warnings)
--max-warnings <count> # Exit with error if warnings exceed count
```

### Fix and Repair Options

Automatic code fixing and problem resolution.

```bash { .api }
# Fixing
--fix                  # Automatically fix problems
--fix-dry-run         # Show fixes without applying them
--fix-type <types>    # Apply fixes for specific problem types

# Fix types: directive, problem, suggestion, layout
--fix-type problem    # Fix only problem-type issues
--fix-type problem,suggestion  # Fix multiple types
```

### Performance and Caching

Options for improving performance and caching results.

```bash { .api }
# Caching
--cache               # Enable result caching
--cache-file <path>   # Cache file location (default: .eslintcache)
--cache-strategy <strategy>  # Cache strategy: metadata or content

# Performance
--concurrency <number>  # Max concurrent linting processes (default: auto)
```

### Output Formatting

Built-in and custom output formatters.

```bash { .api }
# Built-in formatters
eslint --format stylish file.js    # Default human-readable format
eslint --format compact file.js    # Compact format
eslint --format json file.js       # JSON format
eslint --format junit file.js      # JUnit XML format
eslint --format checkstyle file.js # Checkstyle XML format
eslint --format tap file.js        # TAP format
eslint --format unix file.js       # Unix format
eslint --format visualstudio file.js  # Visual Studio format
eslint --format table file.js      # Table format

# Custom formatter
eslint --format ./custom-formatter.js file.js
eslint --format @company/eslint-formatter file.js
```

### Debugging and Information

Options for troubleshooting and getting information.

```bash { .api }
# Information
--version             # Show version number
--help                # Show help information
--env-info           # Show environment information

# Debugging
--debug              # Enable debug mode
--print-config <file>  # Print resolved configuration for file
```

### Special Commands

Special-purpose commands and operations.

```bash { .api }
# Initialization
eslint --init       # Initialize ESLint configuration (uses @eslint/create-config)

# Configuration inspection
eslint --print-config src/index.js  # Show resolved config for file

# Statistics
eslint --stats src/**/*.js  # Show performance statistics

# Experimental features
eslint --flag <flag> src/**/*.js  # Enable experimental features
```

### Exit Codes

ESLint uses specific exit codes to indicate different conditions.

```bash { .api }
# Exit codes
0  # No errors found
1  # One or more errors found
2  # Configuration or setup error
```

## Usage Examples

### Basic Linting

```bash
# Lint all JavaScript files in src directory
eslint src/

# Lint specific file types
eslint --ext .js,.jsx,.ts,.tsx src/

# Lint with specific configuration
eslint --config eslint.config.js src/
```

### Fixing Problems

```bash
# Fix all auto-fixable problems
eslint --fix src/

# Preview fixes without applying
eslint --fix-dry-run src/

# Fix only specific types of problems
eslint --fix --fix-type problem,suggestion src/

# Fix and show what was fixed
eslint --fix --format=@eslint/eslintrc src/
```

### Output Formatting

```bash
# Save results to file
eslint --format json --output-file results.json src/

# Quiet mode (errors only)
eslint --quiet src/

# Fail on warnings
eslint --max-warnings 0 src/

# Multiple output formats
eslint --format stylish src/ > report.txt
eslint --format json src/ > report.json
```

### Performance Optimization

```bash
# Enable caching for faster subsequent runs
eslint --cache src/

# Custom cache location
eslint --cache --cache-file .eslintcache-custom src/

# Control concurrency
eslint --concurrency 4 src/

# Use content-based caching
eslint --cache --cache-strategy content src/
```

### Configuration Management

```bash
# Use specific config file
eslint --config .eslintrc.production.json src/

# Disable config file lookup
eslint --no-config-lookup --config inline-config.json src/

# Print effective configuration
eslint --print-config src/index.js

# Show environment info for debugging
eslint --env-info
```

### Advanced Usage

```bash
# Lint stdin
echo "var x = 1;" | eslint --stdin --stdin-filename virtual.js

# Ignore specific patterns
eslint --ignore-pattern "build/**" --ignore-pattern "*.min.js" src/

# Multiple configurations
eslint --config base.config.js --config override.config.js src/

# Debug mode with verbose output
eslint --debug src/ 2> debug.log
```

## Integration Examples

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint --fix src/",
    "lint:check": "eslint --max-warnings 0 src/",
    "lint:report": "eslint --format json --output-file eslint-report.json src/"
  }
}
```

### CI/CD Integration

```bash
# GitHub Actions / CI environments
eslint --format=@microsoft/eslint-formatter-sarif --output-file eslint-results.sarif src/

# Jenkins integration
eslint --format checkstyle --output-file checkstyle-result.xml src/

# Fail fast in CI
eslint --max-warnings 0 --format compact src/
```

### Pre-commit Hooks

```bash
# Git pre-commit hook
#!/bin/sh
npx eslint --fix $(git diff --cached --name-only --diff-filter=ACM | grep '\.js$')

# Lint-staged integration
npx lint-staged
```

## Configuration File Discovery

ESLint searches for configuration files in the following order:

1. `eslint.config.js` (flat config, recommended)
2. `eslint.config.mjs` 
3. `eslint.config.cjs`
4. `.eslintrc.js` (legacy)
5. `.eslintrc.cjs` (legacy)
6. `.eslintrc.yaml` (legacy) 
7. `.eslintrc.yml` (legacy)
8. `.eslintrc.json` (legacy)
9. `package.json` with `eslintConfig` property (legacy)

## Environment Variables

```bash { .api }
# Disable configuration file lookup
ESLINT_USE_FLAT_CONFIG=true eslint src/

# Custom cache directory
ESLINT_CACHE_DIR=/tmp/eslint-cache eslint --cache src/

# Debug mode
DEBUG=eslint:* eslint src/
```