/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import { exec } from 'child_process';
import eslint from 'gulp-eslint';
import ts from 'gulp-typescript';
import beautify from 'gulp-beautify';

const paths = {
  allSrcJs: 'src/**/*.js',
  allSrcTs: 'src/**/*.ts',
  build1Dir: 'build/step1',
  build2Dir: 'build/step2',
  gulpFile: 'gulpfile.babel.js',
  serverDistDir:'dist/server',
  clientDistDir:'dist/client',
};
const tsProject = ts.createProject('tsconfig.json');

gulp.task('lint', () =>
  gulp.src([paths.allSrcJs, paths.gulpFile])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del.sync(['dist','build']));

gulp.task('ts', () =>
  gulp
  .src(paths.allSrcTs, { base: 'src/' })
  .pipe(tsProject())
  .pipe(beautify())
  .pipe(gulp.dest(paths.build1Dir))
);

gulp.task('copyjs', () =>
  gulp
  .src(paths.allSrcJs, { base: 'src/' })
  .pipe(gulp.dest(paths.build1Dir))
);

gulp.task('build', ['copyjs', 'ts'], () =>
  gulp
  .src(paths.build1Dir + '/**/*.js', { base: paths.build1Dir })
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(babel())
  .pipe(gulp.dest(paths.build2Dir))
);

gulp.task('dist', ['build'], () =>
  gulp
  .src(paths.build2Dir + '/**/*.js', { base: paths.build2Dir })
  .pipe(gulp.dest('./dist'))
);


gulp.task('main', ['dist'], (callback_) => {
  exec(`node ${paths.serverDistDir}`, (error_, stdout_) => {
    console.log(stdout_);
    return callback_(error_);
  });
});

gulp.task('watch', () => {
  gulp.watch([paths.allSrcJs, paths.allSrcTs, paths.gulpFile], ['main']);
});

gulp.task('default', ['clean', 'watch', 'main']);
