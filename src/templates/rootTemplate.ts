import { html } from 'hono/html';

const rootTemplate = html`<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<title>Website Parser</title>
			<meta name="description" content="Website Parser that outputs the relevant content from a given website" />
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
		 	<!-- TODO: change HTMX to redirect to article/id page-->
			<div class="m-2 flex flex-col rounded bg-white p-4">
				<h1 class="p-1 text-center font-title text-4xl font-bold text-green-700 xs:text-5xl">Website Parser</h1>
				<form
					hx-post="/"
					hx-target="this"
					hx-swap="outerHTML"
					class="text-md flex flex-col xs:text-lg"
					novalidate
				>
					<label for="url" class="mb-2">Enter a URL</label>
					<input
						type="url"
						id="url"
						name="url"
						placeholder="https://www.example.com"
						required
						class="peer mb-2 w-full rounded border-2 [:invalid&:not(:placeholder-shown)]:border-red-500 [:invalid&:not(:placeholder-shown)]:text-red-500"
					/>
					<p class="mb-2 hidden text-red-500 peer-[:invalid&:not(:placeholder-shown)]:block">
						Provide a valid URL
					</p>
					<button
						id="submit"
						data-loading-disable
						class="flex max-w-max items-center rounded bg-blue-500 p-2 text-white enabled:hover:bg-blue-600 enabled:focus:bg-blue-600 enabled:active:bg-blue-700 disabled:opacity-50"
					>
						Submit
						<img src="/public/spinner.svg" data-loading class="ml-2 hidden h-5 w-5" />
					</button>
					<script>
						htmx.onLoad(function (evt) {
							const url = document.getElementById('url');
							if (url) {
								url.focus();
								const button = document.getElementById('submit');
								if (button && url.checkValidity()) button.disabled = false;
								else if (button) button.disabled = true;
							}
						});
						htmx.on('input', function (evt) {
							const url = document.getElementById('url');
							const button = document.getElementById('submit');
							if (url && button && url.checkValidity()) button.disabled = false;
							else if (button) button.disabled = true;
						});
					</script>
				</form>
			</div>
		</body>
	</html>`;

export default rootTemplate;
