import { html } from 'hono/html';

export default function validateLoginFormHTML(id: string, error?: string) {
	return html`<div class="m-2 flex flex-col rounded bg-white p-4">
		<h1 class="p-1 text-center font-title text-4xl font-bold text-green-700 xs:text-5xl">Website Parser</h1>
		<form
			hx-post="/login/validate?id=${id}"
			hx-target="closest div"
			hx-swap="outerHTML"
			class="text-md flex flex-col xs:text-lg"
			novalidate
		>
			<label for="passcode" class="mb-2">One-Time Passcode</label>
			<input
				type="text"
				id="passcode"
				name="passcode"
				placeholder="123456"
				pattern="[0-9]{6}"
				required
				class="peer mb-2 w-full rounded border-2 [:invalid&:not(:placeholder-shown)]:border-red-500 [:invalid&:not(:placeholder-shown)]:text-red-500"
			/>
			<p class="mb-2 hidden text-red-500 peer-[:invalid&:not(:placeholder-shown)]:block">
				Provide a valid passcode
			</p>
			<p class="mb-2 text-red-500 empty:hidden">${error}</p>
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
					const passcode = document.getElementById('passcode');
					if (passcode) {
						passcode.focus();
						const button = document.getElementById('submit');
						if (passcode && passcode.checkValidity()) button.disabled = false;
						else if (button) button.disabled = true;
					}
				});
				htmx.on('input', function (evt) {
					const passcode = document.getElementById('passcode');
					const button = document.getElementById('submit');
					if (passcode && button && passcode.checkValidity()) button.disabled = false;
					else if (button) button.disabled = true;
				});
			</script>
		</form>
	</div>`;
}
