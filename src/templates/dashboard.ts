import { html } from 'hono/html';
import { HtmlEscapedString } from 'hono/utils/html';

export default function dashboardHTML(articleCardHtmls: (HtmlEscapedString | Promise<HtmlEscapedString>)[]) {
	return html`<div>
		<div><a href="/article/new">Add</a></div>
		<div>${articleCardHtmls.join('')}</div>
	</div>`;
}
