<p align="center">
  <a href="https://tutors.dev">
    <img src="./tutors-light.png"
  </a>
</p>

<h3 align="center">
Tutors: An Open Learning Web Toolkit
</h3>

<p align="center">
  <a href="https://tutors.dev">Website</a> |
  <a href="https://tutors.dev/course/tutors-reference-manual">Documentation</a>
</p>


- ### What is Tutors?

  Tutors is a collection of open source components and services supporting the creation of transformative learning experiences using open web standards. It consists of two key components:

  - _Generator:_ transforms a [folder of learning content](https://github.com/tutors-sdk/tutors-reference-course) into a Tutors course

  - _Reader_: presents a Tutors course as an intuitive, discoverable and attractive [Web experience](https://tutors.dev/course/reference-course)

  This repo is the Tutors Generators repo. A companion repo:

  - <https://github.com/tutors-sdk/tutors>

  ...host the primary Tutors Reader application. These components are developed in the open by an active and friendly community, based on a [simple set of values](https://tutors.dev/course/tutors-reference-manual#tutors-values).

### The Generators

There are three components making up the generators family of components:

- cli/tutors-model-lib: A shared library encapsulating the core Tutors course model, published to [jsr here](https://jsr.io/@tutors/tutors-model-lib)
- cli/tutors-gen-lib: A shared library encapsulating Tutors course generation logic, published to [jsr here](https://jsr.io/@tutors/tutors-gen-lib)
- cli/tutors-publish: The primary Tutors course generator producing a course for consumption by the Tutors Reader - on [jsr here](https://jsr.io/@tutors/tutors-publish).  
- cli/tutors-publish-html: A secondary Tutors course generator producing a standalond static web site - on [jsr here](https://jsr.io/@tutors/tutors-publish-html).
- cli/tutors-publish-npm: A version of the primary course generator published for backward compatimility to npm - on [npm here](https://www.npmjs.com/package/tutors-publish-npm).

See the tutors manual for [guidance on using the generators](https://tutors.dev/course/tutors-reference-manual#publish ) command line applications.

### Partykit

The Tutors Reader has a "live" feature, whereby students who share their presence appear on a real time dashboard summarising their current learning object interactions. This feature relies on the [Partykit](https://www.partykit.io/) service, and the tutors-party-kit service component here.

### Tutors Repos

  - [Tutors](https://github.com/tutors-sdk/tutors): The course reader application. This is a SvelteKit application, written in TypeScript with a user experience implemented using Tailwind & Skeleton.
  - [Tutors Apps](https://github.com/tutors-sdk/tutors-apps): A monorepo encapsulating the generators, tests + support tools and applications. It is written in TypeScript.
  - [Tutors Reference Manual](https://github.com/tutors-sdk/tutors-reference-manual): The manual is itself a tutors course, and is largely written in Markdown.
  - [Tutors Reference Course](https://github.com/tutors-sdk/tutors-reference-course): A Tutors course to included all tutors learning objects and structures.

# License

[![license](https://img.shields.io/badge/license-MIT-3A929B.svg)](./LICENSE)

This project is licensed under the terms of the [MIT License](./LICENSE).
