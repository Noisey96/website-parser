import { html, raw } from 'hono/html';
import xss from 'xss';

export default function urlTemplate(parsedHtml: string) {
	return html` <article class="prose prose-a:text-blue-600">${raw(xss(parsedHtml))}</article>
		<button
			hx-get="/"
			hx-target="closest body"
			class="mt-2 max-w-max rounded bg-red-500 p-2 text-white hover:bg-red-600 active:bg-red-700"
		>
			Back
		</button>`;
}
