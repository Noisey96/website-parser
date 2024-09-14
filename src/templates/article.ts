import { html, raw } from 'hono/html';
import xss from 'xss';

import { generateCompleteHtml } from '../articleServices';
import { SelectArticles } from '../../db/dev/schema';

export default function articleHTML(article: SelectArticles) {
	const articleHtml = generateCompleteHtml(article);

	// raw(xss())
	return html` <article class="prose prose-a:text-blue-600">${articleHtml}</article>
		<button
			hx-get="/"
			hx-push-url="true"
			hx-target="closest body"
			class="mt-2 max-w-max rounded bg-red-500 p-2 text-white hover:bg-red-600 active:bg-red-700"
		>
			Back
		</button>`;
}
