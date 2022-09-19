#!/usr/bin/env node
import * as fs from 'fs';
import { Course } from 'tutors-lib/src/models/course';
import { HtmlEmitter } from './controllers/html-emitter';
import { copyFolder } from 'tutors-lib/src/utils/futils';

const tutors = require('../package.json').version;
const tutors_lib = require('../package.json').dependencies['tutors-lib-beta'];

const version = `tutors-html-beta ${tutors} (tutors-lib-beta: ${tutors_lib})`;
const nunjucks = require('nunjucks');
const root = __dirname;
nunjucks.configure(root + '/views', { autoescape: false });
nunjucks.installJinjaCompat();

if (fs.existsSync('course.md')) {
  let folder = process.cwd() + '/public-site';
  const course = new Course();
  console.log(`Static course generator ${version}`);
  course.publish(folder);
  const emitter = new HtmlEmitter();
  emitter.generateCourse(folder, course);
  console.log(`${version}`);
  copyFolder(`${root}/src/assets`, folder);
} else {
  console.log('Cannot locate course.md. Change to course folder and try again. ');
}
