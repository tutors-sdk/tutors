# Testing Framework Setup and Usage Guide

## 🚀 Quick Start

### Prerequisites

You need **Deno** installed on your system to run the tests. Choose one of these installation methods:

#### Option 1: Install Deno (Recommended)

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Windows (using Chocolatey):**
```powershell
choco install deno
```

**Windows (using Scoop):**
```powershell
scoop install deno
```

**macOS/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

#### Option 2: Install via npm script

If you prefer to install Deno via npm script:
```bash
npm run install:deno
```

### Verify Installation

After installation, verify Deno is working:
```bash
deno --version
```

## 🧪 Running Tests

### From the root directory:

```bash
# Run all tests
npm run test:tutors-publish-html

# Run only unit tests
npm run test:tutors-publish-html:unit

# Run only integration tests
npm run test:tutors-publish-html:integration

# Run tests with coverage
npm run test:tutors-publish-html:coverage

# Generate HTML coverage report
npm run test:tutors-publish-html:coverage:html

# Run tests in watch mode
npm run test:tutors-publish-html:watch
```

### Installing and running in one step:

```bash
# Install Deno and run tests
npm run test:tutors-publish-html:install
```

### From the cli/tutors-publish-html directory:

```bash
# Run all tests
deno test --allow-read --allow-write --allow-run

# Run specific test files
deno test tests/unit/main-direct.test.ts --allow-read --allow-write --allow-run
deno test tests/unit/path-test.test.ts --allow-read --allow-write --allow-run

# Run with coverage
deno test --coverage=coverage --allow-read --allow-write --allow-run
deno coverage coverage
```

## 📁 Test Structure

```
cli/tutors-publish-html/tests/
├── unit/
│   ├── main.test.ts          # CLI subprocess tests
│   ├── main-direct.test.ts   # Direct function tests
│   └── path-test.test.ts     # Path resolution debugging
├── integration/
│   └── full-workflow.test.ts # Full workflow tests
├── utils/
│   └── test-helpers.ts       # Test utilities
└── README.md                 # Detailed documentation
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "deno: command not found"
**Problem:** Deno is not installed or not in PATH.
**Solution:** 
- Install Deno using one of the methods above
- Restart your terminal/command prompt
- Or use the install script: `npm run install:deno`

#### 2. "Cannot locate course.md"
**Problem:** Tests are running in the wrong directory.
**Solution:** 
- Run tests from the project root using npm scripts
- Or ensure you're in the correct directory when running deno directly

#### 3. "Permission denied" errors
**Problem:** Deno security restrictions.
**Solution:** 
- The test commands include all necessary permissions: `--allow-read --allow-write --allow-run`
- These are already included in the npm scripts

#### 4. Path resolution issues
**Problem:** Tests can't find the main.ts file.
**Solution:** 
- Run the path diagnostic test: `deno test tests/unit/path-test.test.ts --allow-read --allow-write --allow-run`
- This will show you the current working directory and available paths

#### 5. Import errors in IDE
**Problem:** TypeScript/IDE showing import errors.
**Solution:** 
- These are just type checking issues and don't affect test execution
- The tests will run correctly with Deno even if the IDE shows errors
- You can ignore these or configure your IDE to use Deno's TypeScript setup

## 📊 Expected Test Results

### Unit Tests
- **Direct tests** (`main-direct.test.ts`): Test core functions directly
- **Subprocess tests** (`main.test.ts`): Test the CLI behavior
- **Path tests** (`path-test.test.ts`): Debug path resolution

### Integration Tests
- **Full workflow tests**: Run tutors-publish-html on reference course
- **Output validation**: Compare generated HTML to expected reference
- **Asset preservation**: Verify all resources are copied correctly

### Coverage Reports
- **Text coverage**: Shows percentages in terminal
- **HTML coverage**: Detailed line-by-line coverage in `coverage/` directory

## 🎯 Test Types and What They Do

### Direct Function Tests (`main-direct.test.ts`)
- Test `parseCourse()` and `generateStaticCourse()` directly
- More reliable than subprocess tests
- Faster execution
- Better error reporting

### Subprocess Tests (`main.test.ts`)
- Test the actual CLI behavior
- Validate command-line interface
- Test error handling and output messages
- Simulate real-world usage

### Integration Tests (`full-workflow.test.ts`)
- Test complete workflow from course to HTML
- Compare output to reference HTML structure
- Validate different content types (topics, panels, media)
- Test reproducibility and consistency

### Path Tests (`path-test.test.ts`)
- Debug path resolution issues
- Show current working directory
- Test different possible paths to main.ts
- Validate Deno command availability

## 💡 Tips for Success

1. **Start with direct tests**: Run `main-direct.test.ts` first as they're most reliable
2. **Use coverage reports**: Generate HTML coverage to see what's tested
3. **Check path resolution**: Run `path-test.test.ts` if you have path issues
4. **Use npm scripts**: They handle directory changes and permissions automatically
5. **Watch mode**: Use `test:watch` for continuous testing during development

## 📈 Example Successful Test Run

```bash
PS D:\code\tutors_updated\tutors-apps> npm run test:tutors-publish-html:install

> tutors-apps@0.3.0 test:tutors-publish-html:install
> npm run install:deno && npm run test:tutors-publish-html

Deno was installed successfully
Now run the Deno installer:
  deno --version

> tutors-apps@0.3.0 test:tutors-publish-html
> cd cli/tutors-publish-html && deno test --allow-read --allow-write --allow-run

Direct - parseCourse should handle valid course ... ok (15ms)
Direct - generateStaticCourse should create HTML output ... ok (45ms)
Direct - file system operations ... ok (8ms)
Path resolution test ... ok (12ms)
Integration - should generate HTML from reference course ... ok (234ms)
Integration - should match reference HTML structure ... ok (198ms)

ok | 6 passed | 0 failed (512ms)
```

## 🔄 Continuous Integration

The tests are designed to work in CI environments:
- No external dependencies beyond Deno
- Automatic cleanup of temporary files
- Proper error handling and reporting
- Cross-platform compatibility

Add this to your CI configuration:
```yaml
- name: Install Deno
  run: |
    curl -fsSL https://deno.land/install.sh | sh
    echo "$HOME/.deno/bin" >> $GITHUB_PATH

- name: Run tests
  run: npm run test:tutors-publish-html:coverage
```

## 📝 Adding New Tests

1. Create test files in appropriate directories (`tests/unit/` or `tests/integration/`)
2. Import utilities from `../utils/test-helpers.ts`
3. Use descriptive test names
4. Clean up resources in `finally` blocks
5. Add console.log statements for debugging

## 🆘 Getting Help

If you're still having issues:
1. Check the [Deno installation guide](https://deno.land/manual/getting_started/installation)
2. Run the diagnostic test: `deno test tests/unit/path-test.test.ts --allow-read --allow-write --allow-run`
3. Check the detailed test output for specific error messages
4. Try the automatic install: `npm run install:deno` 