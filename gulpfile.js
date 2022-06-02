/* eslint-env node */
const { src, dest, series, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const htmlMinify = require("gulp-htmlmin");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const cssAutoPrefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const inlineCss = require("gulp-inline-css");
const pdf = require("gulp-html-pdf");
const path = require("path");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");

// Options
const browserSyncOptions = {
	open: false,
	browser: false,
	ui: false,
	host: "0.0.0.0",
	server: {
		baseDir: "./dist",
		port: 3000,
	},
};

const htmlOptions = {
	collapseWhitespace: true,
	removeComments: true,
	removeRedundantAttributes: true,
	minifyJS: true
};

const cssOptions = {
	outputStyle: "compressed",
	sourceComments: false,
	sourceMap: false,
};

const inlineCssOptions = {
    preserveMediaQueries: false,
    removeStyleTags: true,
    removeLinkTags: false,
    applyLinkTags: true,
    applyStyleTags: false,
    url: "file://" + path.join(__dirname, "dist") + path.sep,
};

const pdfOptions = {
	format: "A4",
	orientation: "portrait",
	border: "0mm",
	margin: {
		top: "0mm",
		right: "0mm",
		bottom: "0mm",
		left: "0mm",
	},
	printBackground: true,
	pageRanges: "1",
	preferCSSPageSize: true
};

const ejsOptions = {

};

// Tasks
function reload() {
	return browserSync.reload({ stream: true });
}

function handlePDF() {
    return src("dist/resume.html")
		.pipe(pdf(pdfOptions))
		.pipe(dest("./dist"));
}

function handleResumeHtml() {
    return src("src/views/resume.ejs")
		.pipe(ejs(ejsOptions))
		.pipe(inlineCss(inlineCssOptions))
		.pipe(htmlMinify(htmlOptions))
		.pipe(rename({ extname: ".html" }))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function handleLandingPageHtml() {
    return src("src/views/landing.ejs")
		.pipe(ejs(ejsOptions))
		.pipe(htmlMinify(htmlOptions))
        .pipe(rename("index.html"))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchHtml() {
	return watch(["src/**/*.html", "src/**/*.ejs"], parallel(handleResumeHtml, handleLandingPageHtml, handlePDF));
}

function handleSCSS() {
	return src("src/styles/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass(cssOptions).on("error", sass.logError))
		.pipe(cssAutoPrefixer())
		// .pipe(concat("resume.min.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchSCSS() {
	return watch("src/**/*.scss", series(handleSCSS, module.exports.html));
}

function handleAssets() {
	return src("src/assets/**.*", { base: "src" })
		.pipe(dest("./dist"))
		.pipe(reload());
}

function clean() {
	return del("dist");
}

function initialize() {
	return browserSync.init(browserSyncOptions);
}

// Export tasks
module.exports.assets = handleAssets;
module.exports.pdf = handlePDF;
module.exports.html = parallel(handleResumeHtml, handleLandingPageHtml);
module.exports.scss = handleSCSS;
module.exports.clean = clean;

const build = series(module.exports.clean, module.exports.assets, module.exports.scss, module.exports.html);
module.exports.build = series(build, module.exports.pdf);
module.exports.dev = series(build, parallel(watchHtml, watchSCSS, initialize));
module.exports.default = module.exports.build;
