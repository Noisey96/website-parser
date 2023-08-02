import { html, raw } from 'hono/html';
import xss from 'xss';

export default function formTemplate(error = null as string | null) {
	return html`<form hx-post="/" hx-target="this" hx-swap="outerHTML">
		<input type="text" id="url" name="url" placeholder="Enter a URL" />
		${!error || raw(`<p>${raw(xss(error))}</p>`)}
		<button>Submit</button>
	</form>`;
}
