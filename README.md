<p align="center">
  <a href="https://tutors.dev">
    <img src="./static/tutors-light.png"
  </a>
</p>

<h3 align="center">
Tutors: An Open Learning Web Toolkit
</h3>

<p align="center">
  <a href="https://tutors.dev">Website</a> |
  <a href="https://tutors.dev/course/tutors-reference-manual">Documentation</a>
</p>

## Table of Contents

- [What is Tutors](#what-is-tutors)
- [Getting Started](#getting-started)
- [Requesting Features](#requesting-features)
- [Reporting Bugs](#reporting-bugs)
- [Setting Up a Tutors Development Environment](#setting-up-a-tutors-development-environment)
- [Example Tutors Courses](#example-tutors-courses)
- [Tutors Project Repos](#tutors-project-repos)
- [Contributing](#contributing)

## What is Tutors

Tutors is a collection of open source components and services supporting the creation of transformative learning experiences using open web standards. It consists of two key components:

- _Generator:_ transforms a [folder of learning content](https://github.com/tutors-sdk/tutors-reference-course) into a Tutors course

- _Reader_: presents a Tutors course as an intuitive, discoverable and attractive [Web experience](https://tutors.dev/course/reference-course)

This repo is the Tutors Reader. A companion repo:

- <https://github.com/tutors-sdk/tutors-apps>

...host the generators + support tools. These components are developed in the open by an active and friendly community, based on a [simple set of values](https://tutors.dev/course/tutors-reference-manual#tutors-values).

## Getting Started

The first step might be to become familiar with the course structure by [browsing a sample course](https://tutors.dev/course/reference-course), and then scan the [reference manual](https://tutors.dev/course/tutors-reference-manual). The manual will guide you through the process creating and publishing your own course (perhaps a copy of a sample) course. Thereafter you could scan the [Gallery of existing courses](https://tutors.dev/gallery) to get an idea as to how Tutors is used in practice.

Consider setting up your own [development version of tutors](#setting-up-a-tutors-development-environment) for experimentation.

## Reporting Bugs

We are delighted to get bug reports. If you encounter a bug, please open a [Tutors Issue](https://github.com/tutors-sdk/tutors/issues) with a description of the problem. Include information about the environment where the bug occurred, steps to reproduce it, and any relevant screenshots or error messages. Label the issue 'fix'. Perhaps do a quick scan to see if the bug has been reported - if so you might comment / react to the existing error.

## Requesting Features

If you have an idea for a new feature or enhancement, feel free to open a [Tutors Issue](https://github.com/tutors-sdk/tutors/issues). Describe the proposed feature, its benefits, and any other relevant details. Label the new issue `feature`. Perhaps do a quick scan to see if the feature has already been proposed and consider commenting / reacting to the feature instead of creating a new one.

## Setting up a tutors Development Environment

Make sure you have Node 18 + installed, and start by cloning this repo:

```bash
git clone https://github.com/tutors-sdk/tutors.git
```

Open a shell and change into the project folder and run `npm install`...

```bash
cd tutors
npm install
```

Then copy the file `.env.example` to `.env`

```bash
cp .env.example .env
```

Now to start the app you can run this command from the root:

```bash
npm run app
```

This should launch the application:

```bash
  VITE v5.0.12  ready in 1069 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

```

Now the app is up and running and you can browse to it by opening the <a href="http://localhost:3000/">local location</a> in your browser.

The Tutors reader relies on a segment of the url to locate the course to display. Any of the samples above can be 'read' with an appropriate url segments appended to the local url you now have running. So for instance:

- <https://tutors.dev/course/reference-course>

... can be loaded locally by:

- <http://localhost:3000/course/reference-course>

(Note the port number may vary)

The 'source' for the above course is here:

- https://github.com/tutors-sdk/tutors-reference-course

You could try any of the other sample courses above. For example this course:

- https://tutors.dev/course/full-stack-web-dev-oth-2022

can be opened by this local reader like this:

- https://localhost:3000/course/full-stack-web-dev-oth-2022

### Tutors Project Repos

- [Tutors](https://github.com/tutors-sdk/tutors): The course reader application. This is a SvelteKit application, written in TypeScript with a user experience implemented using Tailwind & Skeleton.
- [Tutors Apps](https://github.com/tutors-sdk/tutors-apps): A monorepo encapsulating the generators, tests + support tools and applications. It is written in TypeScript.
- [Tutors Reference Manual](https://github.com/tutors-sdk/tutors-reference-manual): The manual is itself a tutors course, and is largely written in Markdown.
- [Tutors Reference Course](https://github.com/tutors-sdk/tutors-reference-course): A Tutors course to included all tutors learning objects and structures.

### Example Tutors Courses

The reference course might be a place to start:

- [Reference Course](https://github.com/tutors-sdk/tutors-reference-course)

You can clone and rebuild this course following [these instructions.](https://tutors.dev/course/tutors-reference-manual#getting-started)

This is an example of an open source course:

- [Full Stack Development](https://github.com/wit-hdip-comp-sci-2023/full-stack-1)

This is a selected Course Gallery:

- [Gallery of Tutors Courses](https://tutors.dev/gallery)

Some courses of interest:

- [Higher Diploma in Computer Science Portal](https://tutors.dev/course/wit-hdip-comp-sci-showcase)
- [Full Stack Development](https://tutors.dev/course/full-stack-web-dev-oth-2022)
- [Data Analytics](https://tutors.dev/course/data-analytics-essentials)
- [Reference Course](https://tutors.dev/course/reference-course)
- [Higher Diploma in Computer Science at SETU: 2020-2022](https://tutors.dev/course/wit-hdip-comp-sci-2020)
- [Classic Design Patterns](https://tutors.dev/course/classic-design-patterns)
- [Agile Software Development](https://tutors.dev/course/agile-2023)
- [Technologische Fähigkeiten](https://tutors.dev/course/zusatzstudium-digital-skills-semester1)

Note: Some courses will request you authenticate via github for access.

### Contributing

We welcome [feature reuqests](#requesting-features) & [bug reports](#reporting-bugs)! If you would like to try your hand a [tackling an issue](https://github.com/tutors-sdk/tutors/issues) - your own or one off the shelf, then here is how it might work:

1. [Fork the](https://www.freecodecamp.org/news/how-to-fork-a-github-repository/) [tutors repository](https://github.com/tutors-sdk/tutors)
2. [Set up a local build](#setting-up-a-tutors-development-environment)
3. Create a new branch for [your selected issue](https://github.com/tutors-sdk/tutors/issues) (feature or bug fix).
4. Make your changes, and verify that feature behaves as expected in your local build
6. Commit your changes, perhpas consider [following these guideline for commit messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)
7. Push your changes to your fork
8. Submit a pull request to [tutors](https://github.com/tutors-sdk/tutors).


### License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
