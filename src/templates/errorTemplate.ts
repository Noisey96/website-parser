import { html, raw } from 'hono/html';
import xss from 'xss';

export default function errorTemplate(parsedHtml: string) {
	return html`<div id="error">${raw(xss(parsedHtml))}</div>`;
}
