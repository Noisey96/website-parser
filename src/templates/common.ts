import { html, raw } from 'hono/html';
import xss from 'xss';
import { HtmlEscapedString } from 'hono/utils/html';

export function rootHTML(
	pageHTML: HtmlEscapedString | Promise<HtmlEscapedString>,
	menuHTML?: HtmlEscapedString | Promise<HtmlEscapedString>,
) {
	return html`<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>Website Parser</title>
				<meta
					name="description"
					content="Website Parser that outputs the relevant content from a given website"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script src="/public/htmx.min.js"></script>
				<script src="/public/loading-states.js"></script>
				<link rel="stylesheet" href="/public/app.css" />
				<link rel="icon" href="/public/favicon.ico" />
			</head>
			<body hx-ext="loading-states" class="bg-gray-300 font-body">
				${menuHTML}
				<div class="flex flex-col items-center justify-center">${pageHTML}</div>
			</body>
		</html>`;
}

export function mainMenuHTML() {
	return html`<div hx-boost="true">
		<a class="flex flex-row" href="/"><img src="/public/favicon.ico" alt="Logo" /></a>
	</div>`;
}

export function errorHTML(parsedHtml: string) {
	return html`<div class="text-md font-bold xs:text-lg">${raw(xss(parsedHtml))}</div>
		<button
			hx-get="/"
			hx-target="closest body"
			class="mt-2 max-w-max rounded bg-red-500 p-2 text-white hover:bg-red-600 active:bg-red-700"
		>
			Back
		</button>`;
}
