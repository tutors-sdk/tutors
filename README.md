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

- [Higher Diploma in Computer Science at SETU](https://reader.tutors.dev/#/course/wit-hdip-comp-sci-showcase.netlify.app)
- [Full Stack Development at OTH Regensburg](https://reader.tutors.dev/#/course/full-stack-web-dev-oth-2022.netlify.app)
- [Classic Design Patterns at SETU](https://tutors-svelte.netlify.app/#/course/classic-design-patterns.netlify.app)
- [Agile Software Development at SETU](https://reader.tutors.dev/#/course/agile-dev-2021.netlify.app)

# Getting Started

Make sure you have Node 16 + a recent VSCode installed.

<details>
<summary><h2>Running the course reader locally</h2></summary>
Clone this repo, then in the root of the cloned folder open a shell and enter:

```bash
npm install
```

Copy the file in sites/tutors-course-reader called `.env.example` to `.env`

Run the below command from the root folder to run the course reader.

```bash
npm run reader
```

You should see an output similar to below:

```bash
> tutors@0.2.0 reader
> turbo run dev --filter tutors-course-reader

• Packages in scope: tutors-course-reader
• Running dev in 1 packages
cache bypass, force executing 41ecfc6ec2765918

> tutors-course-reader@6.0.4 dev
> vite

VITE v3.1.3  ready in 212 ms

➜  Local:   http://localhost:5001/
➜  Network: http://192.168.112.86:5001/
```

Browse to the local location in a browser - which will display a holding page. You are now running the tutors reader application. This application relies on the url to locate the course to display. Any of the samples above can be 'read' with an appropriate url segments appended to the local url you now have running. So for instance:

```bash
https://reader.tutors.dev/#/course/full-stack-web-dev-oth-2022.netlify.app
```

... can be loaded locally by:

```bash
http://localhost:5001/#/course/full-stack-web-dev-oth-2022.netlify.app
```

You are now running the tutors reader locally, rebuilt from source, to browse a tutors course. You could try any of the other sample courses above.

</details>

If you would like to build your own course then [this workshop here](https://reader.tutors.dev/#/topic/docs.tutors.dev/topic-00-WX) would be a good place to start. In particular, [this lab here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-00-WX/unit-1-creating/book-a) will get you up and running with a sample course in a few minutes. More guidance and examples are on our [Educator documentation](https://reader.tutors.dev/#/topic/docs.tutors.dev/topic-02-EX) site. To learn more about the project, explore the core principles at https://tutors.dev/.

# Project Structure

This is a monorepo for all of the components & services of the [Tutors Open Source Project](https://tutors.dev/). There are three categories of independent sub-projects:

<details>
<summary><h2>Sites</h1></summary>

These are the student facing web applications for browsing a course, an application inspecting course analytics + a storybook encapsulation of UX elements. The principles embodied in the [learner experience are presented here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-03-DX/unit-0/book-plans/01).

### [tutors-course-reader](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-course-reader)

The main tutors user experience - demonstrated in the links above. It is a Svelte application that renders a course in an appealing, context sensitive user experience. An [overview of the user experience is presented here](https://reader.tutors.dev/#/talk/docs.tutors.dev/topic-00-WX/unit-1-creating/talk-1/tutor-ux.pdf). This is deployed to https://reader.tutors.dev

### [tutors-time-reader](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-time-reader)

Also a Svelte application, this application presents the educational analytics gathered by the application. There is a student + an educator perspective. This is deployed to https://time.tutors.dev

### [tutors-home](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-home)

The homepage of the Tutors project built with Astro. This is deployed at https://tutors.dev

### [tutors-vitebook](https://github.com/tutors-sdk/tutors/tree/main/sites/tutors-vitebook)

A storybook style application which visualises the UI components of the Tutors project. This is deployed at https://vitebook.tutors.dev

</details>

<details>
<summary><h2>Apps</h1></summary>

These are command line applications used by educators to generate courses. The principles embodied in the [educator experience are presented here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-03-DX/unit-0/book-plans/02).

### [tutors-json](https://github.com/tutors-sdk/tutors/tree/main/apps/tutors-json)

The primary static site generator for tutors courses. It will inject a folder adhering to a prescribed format and generate a static site that can be rendered by the course reader. The [overall approach + example folder structure is presented here](https://reader.tutors.dev/#/talk/docs.tutors.dev/topic-00-WX/unit-1-creating/talk-2/tutor-ex.pdf). A tutorial on building a new course [can be accessed here](https://reader.tutors.dev/#/lab/docs.tutors.dev/topic-00-WX/unit-1-creating/book-a).

### [tutors-html](https://github.com/tutors-sdk/tutors/tree/main/apps/tutors-html)

An alternative to tutors-json, this command application generate a static site independent of the course reader. This presents a subset of the user experience, and is useful as an offline version of the course for backup purposes.

</details>

<details>
<summary><h2>Components</h2></summary>

Reusable components used in the apps & sites.

### [tutors-configs](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-configs)

A shared set of config files which is used as a base for all sites, apps and components.

### [tutors-lib](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-lib)

The parser library for a course. This component embodies the data structure constructed when in-jesting a course from a folder. Comparable to an Abstract Syntax Tree in a compiler, this tree is traversed to generate JSON and HTML versions by the apps above.

### [tutors-reader-lib](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-reader-lib)

Comparable to tutors-lib, but intended for use in Svelte applications. Constructs a modified AST-like representation of a course as retrieved from a web-hosted, JSON version of a course. Also includes additional tools and utilities used in the readers.

### [tutors-ui](https://github.com/tutors-sdk/tutors/tree/main/components/tutors-ui)

A shared library of UI components which can be used to build the readers, these components are visualised in the vitebook site (https://vitebook.tutors.dev).

</details>

# Contributing

Please ensure to read the [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing to the Tutors project.

When contributing, pull requests should be opened to the 'development' branch, and once tested this will be merged to main.

# Sponsors

This project is powered by [Netlify Open Source](https://www.netlify.com/open-source/).

[![Deploys by Netlify](https://www.netlify.com/v3/img/components/netlify-color-bg.svg)](https://www.netlify.com)

# License

[![license](https://img.shields.io/badge/license-MIT-3A929B.svg)](./LICENSE)

This project is licensed under the terms of the [MIT License](./LICENSE).
