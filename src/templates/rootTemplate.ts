import { html, raw } from 'hono/html';

import formTemplate from './formTemplate';

const rootTemplate = html`<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<title>Website Parser</title>
			<meta name="description" content="Website Parser that outputs the relevant content from a given website" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<script src="/public/htmx.min.js"></script>
			<link rel="stylesheet" href="/public/app.css" />
		</head>
		<body>
			<h1>Website Parser</h1>
			${raw(formTemplate())}
		</body>
	</html>`;

export default rootTemplate;
