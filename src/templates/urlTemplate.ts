import { html, raw } from 'hono/html';
import xss from 'xss';

export default function urlTemplate(parsedHtml: string) {
	return html`<div id="content">${raw(xss(parsedHtml))}</div>`;
}
