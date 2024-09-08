import { html } from 'hono/html';

export default function parseUrlFormHTML() {
	return html`<form
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
		<p class="mb-2 hidden text-red-500 peer-[:invalid&:not(:placeholder-shown)]:block">Provide a valid URL</p>
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
	</form>`;
}
