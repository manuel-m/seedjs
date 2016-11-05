/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import babel from 'gulp-babel';
import beautify from 'gulp-beautify';
import debug from 'gulp-debug';
import del from 'del';
import gulp from 'gulp';
import { exec } from 'child_process';
import eslint from 'gulp-eslint';
import ts from 'gulp-typescript';

import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcHtml: 'src/client/**/*.html',
  allSrcJs: 'src/**/*.js',
  allSrcTs: 'src/**/*.ts',
  build1Dir: 'build/step1_ts',
  build2Dir: 'build/step2_babel',
  clientBundle: 'dist/client/client-bundle.js?(.map)',
  clientDistDir: 'dist/client',
  clientEntryPoint: 'build/step1_ts/client/app.js',
  distDir: 'dist',
  gulpFile: 'gulpfile.babel.js',
  serverDistDir: 'dist/server',
  webpackFile: 'webpack.config.babel.js',
};
const tsProject = ts.createProject('tsconfig.json');

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del.sync(['dist', 'build']));

gulp.task('ts', () =>
  gulp
  .src(paths.allSrcTs, { base: 'src/' })
  .pipe(tsProject())
  .pipe(beautify())
  .pipe(gulp.dest(paths.build1Dir))
);

gulp.task('fetchHtmlForDist', () =>
  gulp
  .src(paths.allSrcHtml, { base: 'src/' })
  .pipe(debug({ title: 'dist Html:' }))
  .pipe(gulp.dest(paths.distDir))
);

gulp.task('fetchJsForTs', () =>
  gulp
  .src(paths.allSrcJs, { base: 'src/' })
  .pipe(gulp.dest(paths.build1Dir))
);

gulp.task('transpileServerJs', ['fetchJsForTs', 'ts'], () =>
  gulp
  // .src(paths.build1Dir + '/**/*.js', { base: paths.build1Dir })
  .src([
    paths.build1Dir + '/**/*.js',
    '!' + paths.build1Dir + '/client/**/*.js'
  ], { base: paths.build1Dir })
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(babel())
  .pipe(gulp.dest(paths.build2Dir))
);

gulp.task('fetchServerJsForDist', ['transpileServerJs'], () =>
  gulp
  .src([
    paths.build2Dir + '/**/*.js',
    '!' + paths.build2Dir + '/client/**/*.js'
  ], { base: paths.build2Dir })
  .pipe(debug({ title: 'dist JS:' }))
  .pipe(gulp.dest(paths.distDir))
);


gulp.task('dist', [
  'fetchHtmlForDist',
  'fetchServerJsForDist',
  'bundleClient'
]);

gulp.task('testServer', ['dist'], (callback_) => {
  exec(`node ${paths.serverDistDir}`, (error_, stdout_) => {
    console.log(stdout_);
    return callback_(error_);
  });
});

gulp.task('bundleClient', ['ts'], (callback_) =>
  gulp.src(paths.clientEntryPoint)
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(paths.clientDistDir))
);

gulp.task('watch', () => {
  gulp.watch([
    paths.allSrcJs,
    paths.allSrcTs,
    paths.gulpFile
  ], ['testServer']);
});

gulp.task('default', ['clean', 'watch', 'testServer']);
