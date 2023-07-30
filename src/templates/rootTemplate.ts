import { html } from 'hono/html';

const rootTemplate = html`<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<title>Website Parser</title>
			<meta name="description" content="Website Parser that outputs the relevant content from a given website" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<script src="/htmx.min.js"></script>
			<link rel="stylesheet" href="/app.css" />
		</head>
		<body>
			<h1>Website Parser</h1>
			<form hx-post="/" hx-target="this" hx-swap="outerHTML">
				<input type="text" id="url" name="url" placeholder="Enter a URL" />
				<button>Submit</button>
			</form>
		</body>
	</html>`;

export default rootTemplate;
