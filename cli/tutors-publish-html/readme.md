# Tutors HTML Publisher

Command-line tool for generating static HTML-based Tutors courses, ideal for offline viewing and static hosting.

## Usage

Basic command to run the generator:

```bash
deno run -A jsr:@tutors/tutors-publish-html
```

## Features

- Generates a complete static HTML site
- Creates self-contained course pages
- Supports offline viewing
- Processes course assets locally
- Maintains course navigation and structure

## Output

The generator creates:
- An `html` folder containing the static site
- Self-contained HTML pages for each course component
- Local asset management
- Navigation structure

## Viewing

1. Local Viewing:
   - Run the generator
   - Open `html/home.html` in your browser

2. Static Hosting:
   - Deploy the `html` folder to any static web host
   - No special server configuration required

## Templates

Uses Vento templating engine to generate:
- Responsive layouts
- Navigation components
- Content cards
- Lab navigation
- Wall views

For more details on course structure and requirements, see the [Tutors Reference Manual](https://tutors.dev/course/tutors-reference-manual).