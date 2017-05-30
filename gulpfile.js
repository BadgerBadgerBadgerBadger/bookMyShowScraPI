'use strict'

const gulp = require(`gulp`)
const clean = require(`gulp-clean`)
const sourcemaps = require(`gulp-sourcemaps`)
const ts = require(`gulp-typescript`)

const tsProject = ts.createProject(`tsconfig.json`)

const otherFiles = [`./src/**/*`, `!./src/**/*.ts`]
const dest = `lib`

gulp.task(`clean`, function() {
  return gulp.src(dest, {read: false})
    .pipe(clean());
})

gulp.task(`ts`, [`clean`], function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest))
})

gulp.task(`copy`, [`clean`], function () {
  return gulp
    .src(otherFiles)
    .pipe(gulp.dest(dest))
})

gulp.task(`default`, [`ts`, `copy`])
