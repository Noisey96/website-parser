import { html } from 'hono/html';

export default function loginFormHTML(error?: string) {
	return html`<div class="m-2 flex flex-col rounded bg-white p-4">
		<h1 class="p-1 text-center font-title text-4xl font-bold text-green-700 xs:text-5xl">Website Parser</h1>
		<form hx-post="/login" hx-target="closest div" hx-swap="outerHTML" class="text-md flex flex-col xs:text-lg" novalidate>
			<label for="email" class="mb-2">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				placeholder="name@example.com"
				required
				class="peer mb-2 w-full rounded border-2 [:invalid&:not(:placeholder-shown)]:border-red-500 [:invalid&:not(:placeholder-shown)]:text-red-500"
			/>
			<p class="mb-2 hidden text-red-500 peer-[:invalid&:not(:placeholder-shown)]:block">Provide a valid email</p>
			<label for="password" class="mb-2">Password</label>
			<input type="password" id="password" name="password" required class="peer mb-2 w-full rounded border-2" />
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
					const email = document.getElementById('email');
					const password = document.getElementById('password');
					if (email && password) {
						email.focus();
						const button = document.getElementById('submit');
						if (button && email.checkValidity() && password.checkValidity()) button.disabled = false;
						else if (button) button.disabled = true;
					}
				});
				htmx.on('input', function (evt) {
					const email = document.getElementById('email');
					const password = document.getElementById('password');
					const button = document.getElementById('submit');
					if (email && password && button && email.checkValidity() && password.checkValidity())
						button.disabled = false;
					else if (button) button.disabled = true;
				});
			</script>
		</form>
	</div>`;
}
