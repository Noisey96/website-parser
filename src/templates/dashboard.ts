import { html } from 'hono/html';
import { HtmlEscapedString, raw } from 'hono/utils/html';

export default function dashboardHTML(articleCardHtmls: (HtmlEscapedString | Promise<HtmlEscapedString>)[]) {
	return html`<div>
		<button
			hx-get="/article/new"
			hx-push-url="true"
			hx-target="closest div"
			class="mt-2 max-w-max rounded bg-green-500 p-2 text-white hover:bg-green-600 active:bg-green-700"
		>
			Add
		</button>
		<div>${raw(articleCardHtmls.join(''))}</div>
	</div>`;
}
