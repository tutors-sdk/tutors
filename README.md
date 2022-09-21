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

A collection of open source components & services supporting the creation of transformative learning experiences using open web standards.

# Overview of Tutors

This is a monorepo for all of the components & services of the Tutors Open Source Project. This is broken down into 3 sections - Apps, Components & Sites.

# Components & Services

## Apps

### tutors-html

A static site generator application that creates a website from a course.

### tutors-json

Converts a course into json, which can be read by the tutors course reader.

## Components

### tutors-configs

A shared set of config files which is used as a base in components & services.

### tutors-lib

A shared library for Tutors

### tutors-reader-lib

A library used by the tutors-course-reader

### tutors-ui

A shared library of UI components which can be used to build a Tutors site.

## Sites

### tutors-course-reader

A reader which consumes the output of the tutors-json app.

### tutors-time-reader

### tutors-vitebook

A web page which displays the UI components of the tutors-ui library.

# Contributing

Please ensure to read the [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing to the Tutors project.

# Sponsors

This project is powered by [Netlify Open Source](https://www.netlify.com/open-source/).

[![Deploys by Netlify](https://www.netlify.com/v3/img/components/netlify-color-bg.svg)](https://www.netlify.com)

# License

[![license](https://img.shields.io/badge/license-MIT-3A929B.svg)](./LICENSE)

This project is licensed under the terms of the [MIT License](./LICENSE).
