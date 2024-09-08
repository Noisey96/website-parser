import { html, raw } from 'hono/html';
import xss from 'xss';

export default function errorHTML(parsedHtml: string) {
	return html`<div class="text-md font-bold xs:text-lg">${raw(xss(parsedHtml))}</div>
		<button
			hx-get="/"
			hx-target="closest body"
			class="mt-2 max-w-max rounded bg-red-500 p-2 text-white hover:bg-red-600 active:bg-red-700"
		>
			Back
		</button>`;
}
