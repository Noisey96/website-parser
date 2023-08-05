import { html } from 'hono/html';

const rootTemplate = html`<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<title>Website Parser</title>
			<meta name="description" content="Website Parser that outputs the relevant content from a given website" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<script src="/public/htmx.min.js"></script>
			<script src="/public/_hyperscript.min.js"></script>
			<link rel="stylesheet" href="/public/app.css" />
		</head>
		<body class="flex min-h-screen flex-col items-center justify-center font-body">
			<h1 class="font-title text-5xl">Website Parser</h1>
			<form hx-post="/" hx-target="this" hx-swap="outerHTML" class="flex flex-col items-center text-lg">
				<label for="url">Enter a URL</label>
				<input type="text" id="url" name="url" placeholder="https://www.example.com" />
				<div style="display: none;">Invalid URL</div>
				<button>Submit</button>
			</form>
		</body>
	</html>`;

export default rootTemplate;
