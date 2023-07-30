import { html } from 'hono/html';

export default function urlTemplate(parsedHtml: string) {
	return html`<div id="content">${parsedHtml}</div>`;
}
