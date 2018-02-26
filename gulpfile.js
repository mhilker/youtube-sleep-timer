const gulp = require('gulp');
const source = require("vinyl-source-stream");
const rollup = require('rollup-stream');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const del = require('del');
const watch = require('gulp-watch');

const dist = './dist';

const scripts = [
    {taskName: 'buildBackground', entry: './src/background/background.js', source: 'background.js', dest: `${dist}/background`},
    {taskName: 'buildAction', entry: './src/action/action.js', source: 'action.js', dest: `${dist}/action`},
    {taskName: 'buildContent', entry: './src/content/content.js', source: 'content.js', dest: `${dist}/content`}
];

gulp.task('default', ['build']);

gulp.task('clean', () => {
    del([`${dist}/**/*`, `${dist}/.*`, './web-ext-artifacts/'])
});

gulp.task('copyStaticContent', () => {
    gulp.src(['./src/**', '!./src/**/*.js']).pipe(gulp.dest("./dist"))
});

let rollupCache;

scripts.forEach(script => {
    gulp.task(script.taskName, () => {
        rollup({
            input: script.entry,
            format: 'es',
            exports: 'none',
            plugins: [ resolve(), commonjs() ],
            cache: rollupCache
        }).on('unifiedcache', unifiedCache => rollupCache = unifiedCache)
            .pipe(source(script.source))
            .pipe(gulp.dest(script.dest));
    });
});


gulp.task('watch', function () {
    return watch(['src/**/*.*'], { ignoreInitial: false }).pipe(gulp.dest('build'));
});

gulp.task('build', ['copyStaticContent'].concat(scripts.map(script => script.taskName)));
