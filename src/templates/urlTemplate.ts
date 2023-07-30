import { html, raw } from 'hono/html';

export default function urlTemplate(parsedHtml: string) {
	return html`<div id="content">${raw(parsedHtml)}</div>`;
}
