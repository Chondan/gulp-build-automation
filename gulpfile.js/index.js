/* eslint-disable import/no-extraneous-dependencies */
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const {
    src, dest, watch, parallel, series,
} = require('gulp');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const sync = require('browser-sync').create();
const { ROOT_DIR, getDir } = require('./utils');

function generateCSS(cb) {
    return src(getDir(ROOT_DIR, 'sass/**/*.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(getDir(ROOT_DIR, 'public/stylesheets')))
        .pipe(sync.stream()) // it notifies BrowserSync about change in css
        .on('end', cb);
}

function generateHTML(cb) {
    return src(getDir(ROOT_DIR, 'views/index.ejs'))
        .pipe(ejs({
            title: 'Hello Semaphore!',
        }))
        .pipe(rename({
            extname: '.html',
        }))
        .pipe(dest(getDir(ROOT_DIR, 'public')))
        .on('end', cb);
}

function runLinter(cb) {
    return src(
        [
            getDir(ROOT_DIR, '**/*.js'),
            `!${getDir(ROOT_DIR, 'node_modules/**')}`,
        ],
    )
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('end', cb);
}

function runTests(cb) {
    return src([getDir(ROOT_DIR, '**/*.test.js')])
        .pipe(mocha())
        .on('error', () => {
            cb(new Error('Test failed'));
        })
        .on('end', cb);
}

const watchLists = {
    ejs: getDir(ROOT_DIR, 'views/**.ejs'),
    scss: getDir(ROOT_DIR, 'sass/**.scss'),
    js: [
        getDir(ROOT_DIR, '**/*.js'),
        `!${getDir(ROOT_DIR, 'node_modules/**')}`,
    ],
    html: getDir(ROOT_DIR, 'public/**.html'),
};

function watchFiles(cb) {
    watch(watchLists.ejs, generateHTML);
    watch(watchLists.scss, generateCSS);
    watch(watchLists.js, parallel(runLinter, runTests));
    cb();
}

// --- Creating Server for Live Reload ---
function browserSync(cb) {
    sync.init({
        server: {
            baseDir: getDir(ROOT_DIR, 'public'),
        },
    });

    watch(watchLists.ejs, generateHTML);
    watch(watchLists.scss, generateCSS);
    watch(watchLists.html).on('change', sync.reload);
    cb();
}

exports.css = generateCSS;
exports.html = generateHTML;
exports.lint = runLinter;
exports.test = runTests;
exports.watch = watchFiles;
exports.sync = browserSync;
exports.default = series(
    runLinter, parallel(generateHTML, generateCSS), runTests,
);
