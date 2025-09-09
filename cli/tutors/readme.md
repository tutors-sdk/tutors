# Tutors Publisher

Command-line tool for generating dynamic Tutors courses, designed for deployment to web platforms like Netlify.

## Usage

Basic command to run the generator:

```bash
deno run -A jsr:@tutors/tutors
```

## Features

- Generates a JSON-based course structure
- Creates Netlify-ready deployment files
- Supports automatic deployment through Netlify integration
- Processes all course assets and resources
- Generates LLM-ready content when enabled

## Output

The generator creates:
- A `json` folder containing the course structure
- Netlify configuration files
- Asset management for course resources

## Deployment

1. Manual:
   - Run the generator
   - Drag & drop the `json` folder to Netlify

2. Automated:
   - Configure GitHub integration with Netlify
   - Set build command: `deno run -A jsr:@tutors/tutors-publish`
   - Set publish directory: `json`

For more details on course structure and requirements, see the [Tutors Reference Manual](https://tutors.dev/course/tutors-reference-manual).