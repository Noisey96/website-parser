// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';
import { html } from 'hono/html';

import { InsertArticles, SelectArticles } from '../../db/dev/schema';
import { HtmlEscapedString, raw } from 'hono/utils/html';
import xss from 'xss';

export async function parseArticle(url: string): Promise<InsertArticles> {
	const article = (await Parser.parse(url, {
		contentType: 'markdown',
	})) as InsertArticles;

	const content = article.content as string;
	const contentHtml = await marked.parse(content);
	// TODO: parse HTML to be safe
	article.content = contentHtml;

	return article;
}

export function generateCompleteHtml(article: SelectArticles): HtmlEscapedString | Promise<HtmlEscapedString> {
	return html`<h2>${article.title}</h2>
		${article.excerpt ? html`<em>${article.excerpt}</em>` : ''}
		${article.author && article.date_published
			? html`<h3>By ${article.author} on ${new Date(article.date_published).toLocaleDateString()}</h3>`
			: ''}
		${article.author && !article.date_published ? html`<h3>By ${article.author}</h3>` : ''}
		${!article.author && article.date_published
			? html`<h3>On ${new Date(article.date_published).toLocaleDateString()}</h3>`
			: ''}
		${article.lead_image_url ? html`<img src="${article.lead_image_url}" alt="${article.lead_image_url}" />` : ''}
		${article.content ? raw(xss(article.content)) : ''}`;
}

export function generateCardHtml(article: SelectArticles): HtmlEscapedString | Promise<HtmlEscapedString> {
	return html`<div class="w-[calc(100%_/_3_-_(theme(gap.2)_*_2_/_3))]">
		<button
			hx-get="/article/${article.id}"
			hx-push-url="true"
			hx-target="#content"
			class="rounded border border-black bg-slate-500 p-2 text-white hover:bg-slate-600 hover:text-white active:bg-slate-700"
		>
			${article.lead_image_url
				? html`<img src="${article.lead_image_url}" alt="${article.lead_image_url}" />`
				: html`<img src="/public/image-not-found.jpg" alt="Image not found" />`}
			<h2>${article.title}</h2>
		</button>
	</div>`;
}
