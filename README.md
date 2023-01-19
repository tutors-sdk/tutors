<p align="center">
  <a href="https://tutors.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="./assets/tutors-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="./assets/tutors-light.png">
      <img alt="Text changing depending on mode. Light: 'Tutors Light Mode Logo' Dark: 'Tutors Dark Mode Logo'" src="./assets/tutors-light.png">
    </picture>    
  </a>
</p>

<h3 align="center">
Tutors: An Open Learning Web Toolkit
</h3>

<p align="center">
  <a href="https://tutors.dev">Website</a> |
  <a href="https://docs.tutors.dev">Documentation</a> |
  <a href="#">Coming Soon</a>
</p>

# What is Tutors?

A collection of open source components & services supporting the creation of transformative learning experiences using open web standards. Some representative examples:

- [Higher Diploma in Computer Science Portal](https://reader.tutors.dev/course/wit-hdip-comp-sci-showcase)
- [Full Stack Development](https://reader.tutors.dev/course/full-stack-web-dev-oth-2022)
- [Reference Course](https://reader.tutors.dev/course/tutors-reference)
- [Higher Diploma in Computer Science at SETU: 2020-2022](https://reader.tutors.dev/course/wit-hdip-comp-sci-2020)
- [Classic Design Patterns](https://tutors-svelte.netlify.app/course/classic-design-patterns)
- [Agile Software Development](https://reader.tutors.dev/course/agile-dev-2021)
- [Technologische Fähigkeiten](https://reader.tutors.dev/course/zusatzstudium-digital-skills-semester1)

# Getting Started

Make sure you have Node 16 + installed, and start by cloning this repo:

```bash
git clone https://github.com/tutors-sdk/tutors.git
```

Open a shell and...

```bash
cd tutors
npm install
npm run build
```

This may take a few minutes, and should conclude with:

```text
...
Tasks:    6 successful, 6 total
Cached:   0 cached, 6 total
```

Change directory into sites/tutors-course-reader

```bash
cd apps/course
```

and copy the file `.env.example` to `.env`

```bash
cp .env.example .env
```

Now to start our reader with this command:

```bash
npm run dev
```

You should see an output similar to below:

```bash
> tutors-course@8.2.0 dev

> vite dev --port 3000 --open



  VITE v4.0.4  ready in 1344 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
18:16:18 [vite-plugin-svelte] ssr compile in progress ...
Using browser-only version of superagent in non-browser environment
18:16:30 [vite-plugin-svelte] ssr compile done.
package                 files    time      avg
@skeletonlabs/skeleton     45   0.33s    7.4ms
tutors-course              19   0.22s   11.3ms
tutors-ui                  21   0.11s    5.4ms
@iconify/svelte             1   8.8ms    8.8ms
```

Now our Reader is up and running and you can browse to it by opening the <a href="http://localhost:3000/">local location</a> in your browser. You should see a holding page informing you that you are running a reader with no content.
The reader relies on a segment of the url to locate the course to display. Any of the samples above can be 'read' with an appropriate url segments appended to the local url you now have running. So for instance:

```bash
https://reader.tutors.dev/course/tutors-reference
```

... can be loaded locally by:

```bash
http://localhost:3000/course/tutors-reference
```

(Note the port number may vary - for example 3000)

The 'source' for the above course is here:

- https://github.com/tutors-sdk/tutors-template

You could try any of the other sample courses above.

If you would like to build your own course then [this workshop here](https://reader.tutors.dev/topic/tutors-docs/topic-00-WX) would be a good place to start. In particular, [this lab here](https://reader.tutors.dev/lab/tutors-docs/topic-00-WX/unit-1-creating/book-a) will get you up and running with a sample course in a few minutes. More guidance and examples are on our [Educator documentation](https://reader.tutors.dev/topic/tutors-docs/topic-02-EX) site. To learn more about the project, explore the core principles at https://tutors.dev/.

If you have VSCode, you should be able to open project.

# Project Structure

This is a monorepo for all of the components & services of the [Tutors Open Source Project](https://tutors.dev/). There are three categories of independent sub-projects:

## Sites

These are the student facing web applications for browsing a course, an application inspecting course analytics + a storybook encapsulation of UX elements. The principles embodied in the [learner experience are presented here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-03-DX/unit-0/book-plans/01).

### [tutors-course-reader](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-course-reader)

The main tutors user experience - demonstrated in the links above. This can be built and launched via the instructions above. It is a SvelteKit application that renders a course in an appealing, context sensitive user experience. An [overview of the user experience is presented here](https://reader.tutors.dev/talk/docs.tutors.dev/topic-00-WX/unit-1-creating/talk-1/tutor-ux.pdf). This is deployed to https://reader.tutors.dev

### [tutors-time-reader](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-time-reader)

Also a Svelte application, this application presents the educational analytics gathered by the application. There is a student + an educator perspective. This is deployed to https://time.tutors.dev

### [tutors-home](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-home)

The homepage of the Tutors project built with Astro. This is deployed at https://tutors.dev

## Apps

These are command line applications used by educators to generate courses. The principles embodied in the [educator experience are presented here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-03-DX/unit-0/book-plans/02).

### [tutors-json](https://github.com/tutors-sdk/tutors/tree/main/apps/tutors-json)

The primary static site generator for tutors courses. It will injest a folder adhering to a prescribed format and generate a static site that can be rendered by the course reader. The [overall approach + example folder structure is presented here](https://reader.tutors.dev/#/talk/docs.tutors.dev/topic-00-WX/unit-1-creating/talk-2/tutor-ex.pdf). A tutorial on building a new course [can be accessed here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-00-WX/unit-1-creating/book-a).

### [tutors-html](https://github.com/tutors-sdk/tutors/tree/main/apps/tutors-html)

An alternative to tutors-json, this command line application generates a static site independent of the course reader. This presents a subset of the user experience, and is useful as an offline version of the course for backup purposes.

## Components

Reusable components used in the apps & sites.

### [tutors-configs](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-configs)

A shared set of config files which is used as a base for all sites, apps and components.

### [tutors-lib](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-lib)

The parser library for a course. This component embodies the data structures constructed when in-jesting a course from a folder. Comparable to an Abstract Syntax Tree in a compiler, this tree is traversed to generate JSON and HTML versions by the apps above.

### [tutors-reader-lib](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-reader-lib)

Comparable to tutors-lib, but intended for use in Svelte applications. Constructs a modified AST-like representation of a course as retrieved from a web-hosted, JSON version of a course. Also includes additional tools and utilities used in the readers.

### [tutors-ui](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-ui)

A shared library of UI components which can be used to build Tutors.

# Contributing

Please ensure to read the [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing to the Tutors project.

When contributing, pull requests should be opened to the 'development' branch, and once tested this will be merged to main.

# Sponsors

This project is powered by [Netlify Open Source](https://www.netlify.com/open-source/).

[![Deploys by Netlify](https://www.netlify.com/v3/img/components/netlify-color-bg.svg)](https://www.netlify.com)

# License

[![license](https://img.shields.io/badge/license-MIT-3A929B.svg)](./LICENSE)

This project is licensed under the terms of the [MIT License](./LICENSE).
