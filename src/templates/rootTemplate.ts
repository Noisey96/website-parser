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
		<body class="flex min-h-screen flex-col items-center justify-center bg-gray-300 font-body">
			<div class="m-2 flex flex-col rounded bg-white p-4">
				<h1 class="p-1 text-center font-title text-4xl font-bold text-green-700 xs:text-5xl">Website Parser</h1>
				<form hx-post="/" hx-target="this" hx-swap="outerHTML" class="text-md flex flex-col xs:text-lg">
					<label for="url" class="mb-2">Enter a URL</label>
					<input
						type="text"
						id="url"
						name="url"
						placeholder="https://www.example.com"
						class="mb-2 w-full rounded border border-black p-1"
					/>
					<button
						class="flex max-w-max rounded bg-blue-500 p-2 text-white hover:bg-blue-600 active:bg-blue-700"
					>
						Submit
					</button>
				</form>
			</div>
		</body>
	</html>`;

export default rootTemplate;
