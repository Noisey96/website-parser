import { html, raw } from 'hono/html';
import xss from 'xss';

export default function urlTemplate(parsedHtml: string) {
	return html`<article class="prose">${raw(xss(parsedHtml))}</article>`;
}
