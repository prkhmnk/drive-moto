const { src, dest, watch, series, parallel } = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const pug = require("gulp-pug");
const sass = require(`gulp-sass`)(require(`sass`));
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`postcss-csso`);
const rename = require(`gulp-rename`);
const htmlmin = require(`gulp-htmlmin`);
const terser = require(`gulp-terser`);
const squoosh = require(`gulp-libsquoosh`);
const webp = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`);
const del = require(`del`);
const sync = require(`browser-sync`).create();
const concat = require(`gulp-concat`);

const { source, destination } = {
  source: `source`,
  destination: `build`,
};

// Styles

const styles = () => {
  return src(`${source}/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(dest(`${destination}/css`))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(dest(`${destination}/css`))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML

const html = () => {
  return src([`${source}/pug/**/*.pug`, `!${source}/pug/includes/**/*.pug`])
    .pipe(pug({ pretty: true }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(destination));
};

// Scripts

const scripts = () => {
  return src([`node_modules/jquery/dist/jquery.js`, `${source}/js/script.js`])
    .pipe(concat(`main.min.js`))
    .pipe(terser())
    .pipe(dest(`${destination}/js`))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return src(`${source}/img/**/*.{png,jpg,svg}`)
    .pipe(squoosh())
    .pipe(dest(`${destination}/img`));
};

exports.images = optimizeImages;

const copyImages = () => {
  return src([
    `${source}/img/**/*.{png,jpg,svg}`,
    `!${source}/img/icons/*.svg`,
  ]).pipe(dest(`${destination}/img`));
};

exports.images = copyImages;

// WebP

const createWebp = () => {
  return src(`${source}/img/**/*.{jpg,png}`)
    .pipe(webp({ quality: 90 }))
    .pipe(dest(`${destination}/img`));
};

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return src(`${source}/img/icons/*.svg`)
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename(`sprite.svg`))
    .pipe(dest(`${destination}/img`));
};

exports.sprite = sprite;

// Copy

const copy = (done) => {
  src(
    [
      `${source}/manifest.webmanifest`,
      `${source}/fonts/*.{woff2,woff}`,
      `${source}/*.ico`,
    ],
    {
      base: source,
    }
  ).pipe(dest(destination));
  done();
};

exports.copy = copy;

// Clean

const clean = () => {
  return del(destination);
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: destination,
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  watch(`${source}/sass/**/*.scss`, series(styles, reload));
  watch(`${source}/js/**/*.js`, series(scripts));
  watch(`${source}/pug/**/*.pug`, series(html, reload));
};

// Build

const build = series(
  clean,
  copy,
  optimizeImages,
  parallel(styles, html, scripts, sprite, createWebp)
);

exports.build = build;

// Default

exports.default = series(
  clean,
  copy,
  copyImages,
  parallel(styles, html, scripts, sprite, createWebp),
  series(server, watcher)
);
