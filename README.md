# My Resume

This repository contains the source code I wrote for generating my resume.

[Live demo](https://leandrosq.github.io/html-resume/)

## Motivation

I tried using Word, Canva and other tools but couldn't get them to look like what I wanted. Therefore I decided to write my resume in Markdown, which was simple enough but does not provide styling, then I decided to move to HTML.
This project is basically a Website, you can even see it on the [Live demo](https://leandrosq.github.io/html-resume/), what happens is that the style adequate to a PDF A4 page when printing the HTML page. This worked really great and it took ~30 minutes to finish, so I decided to automate the process of generating the resume using puppeteer and make a landing page with it as well.

## Features

| Feature | Description |
| --- | --- |
| HTML to PDF | Uses [Puppeteer](https://pptr.dev/) to generate a PDF from the HTML page. |
| Dark and light mode | Using [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) |
| Fully responsive | Using [CSS media queries](https://www.w3schools.com/css/css_rwd_mediaqueries.asp) |
| Customizable | You can change the style of the resume using [SCSS](https://sass-lang.com/) |
| Modular | Uses [EJS](https://ejs.co/) to process HTML templates |
| Masonry layout | Uses vanilla JS to create a masonry layout, this I've made just for this project. Fully responsible and dynamic. |
| Custom fonts | Uses [Google Fonts](https://fonts.google.com/) |
| Animated | Uses [Animista](https://animista.net/) |
| Automated | Uses [Github Actions](https://github.com/features/actions) for building, publishing the [website](https://leandrosq.github.io/html-resume/) and generating the PDF |
| Live demo | Uses [GitHub Pages](https://pages.github.com/) for hosting the website |
| SVG Icons | Uses [Material Design Icons](https://materialdesignicons.com/) |

## How to use for yourself

Clone the repository and on the terminal run the following commands:

- `npm install` or `yarn` for installing dependencies
- `npm run build` or `yarn build` for building the website
- `npm run start` or `yarn start` for starting the http server at port 3000

For development, you can also run the following command:

- `npm run dev` or `yarn dev` for starting the http server at port 3000 with auto-reload
