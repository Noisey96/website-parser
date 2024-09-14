import { html } from 'hono/html';
import { HtmlEscapedString, raw } from 'hono/utils/html';
import xss from 'xss';

export default function dashboardHTML(articleCardHtmls: (HtmlEscapedString | Promise<HtmlEscapedString>)[]) {
	return html`<div>
		<div><a href="/article/new">Add</a></div>
		<div>${articleCardHtmls}</div>
	</div>`;
}
