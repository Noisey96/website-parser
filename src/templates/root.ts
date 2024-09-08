import { html } from 'hono/html';
import { HtmlEscapedString } from 'hono/utils/html';

export default function rootHTML(formHTML: HtmlEscapedString | Promise<HtmlEscapedString>) {
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
			<body
				hx-ext="loading-states"
				class="flex min-h-screen flex-col items-center justify-center bg-gray-300 font-body"
			>
				<div class="m-2 flex flex-col rounded bg-white p-4">
					<h1 class="p-1 text-center font-title text-4xl font-bold text-green-700 xs:text-5xl">
						Website Parser
					</h1>
					${formHTML}
				</div>
			</body>
		</html>`;
}
