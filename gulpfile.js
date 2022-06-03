/* eslint-env node */
const { src, dest, series, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const htmlMinify = require("gulp-htmlmin");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const path = require("path");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const puppeteer = require("puppeteer");

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

const pdfOptions = {
	format: "A4",
	orientation: "portrait",
	border: "0",
	printBackground: true,
	pageRanges: "1",
	preferCSSPageSize: false,
};

const ejsOptions = {

};

const autoPrefixerOptions = {
	grid: "autoplace",
	remove: false,
};

const jsOptions = {

};

const puppeteerOptions = {
	headless: true,
	args: [
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-web-security",
	],
};

// Tasks
function reload() {
	return browserSync.reload({ stream: true });
}

function delay(amount) {
	return new Promise((resolve, _) => {
		setTimeout(() => {
			resolve();
		}, amount);
	});
}

async function handlePDF(callback) {
    const input = `dist/index.html`;
	const output = `dist/resume.pdf`;

	// Mount the local file system to the remote URL
	const filename = `file://${path.join(
		__dirname,
		input.replace("/", path.sep)
	)}`;

	// Open the browser
	const browser = await puppeteer.launch(puppeteerOptions);
	// Open a new tab
	const page = await browser.newPage();
	// Navigate to the resume.html file
	await page.goto(filename);

	// Define global variable for ignoring mobile css when generating the PDF
	await page.evaluate(function () { window._printing = true; });
	await page.waitForSelector(".masonry", { waitUntil: "networkidle0" });
	await delay(500);
	
	// Generate the PDF
	await page.pdf({ ...pdfOptions, path: output });
	// Close the browser
	await browser.close();

	callback();
}

function handleHTML() {
    return src("src/views/index.ejs")
		.pipe(ejs(ejsOptions))
		.pipe(htmlMinify(htmlOptions))
        .pipe(rename("index.html"))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchHtml() {
	return watch(["src/**/*.html", "src/**/*.ejs"], parallel(handleHTML, handlePDF));
}

function handleSCSS() {
	return src("src/styles/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass(cssOptions).on("error", sass.logError))
		.pipe(postcss([autoprefixer(autoPrefixerOptions)]))
		.pipe(sourcemaps.write("./"))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchSCSS() {
	return watch("src/**/*.scss", series(handleSCSS, handleHTML, handlePDF));
}

function handleJS() {
	return src("src/scripts/*.js")
		.pipe(sourcemaps.init())
		.pipe(uglify(jsOptions))
		.pipe(sourcemaps.write("./"))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchJS() {
	return watch("src/**/*.js", handleJS);
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
module.exports.html = handleHTML;
module.exports.scss = handleSCSS;
module.exports.js = handleJS;
module.exports.clean = clean;

const build = series(module.exports.clean, module.exports.assets, module.exports.scss, module.exports.html, module.exports.js);
module.exports.dev = series(build, parallel(watchHtml, watchSCSS, watchJS, initialize));
module.exports.build = series(build, module.exports.pdf);
module.exports.default = module.exports.build;
