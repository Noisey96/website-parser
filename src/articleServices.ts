// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';
import { html } from 'hono/html';

import { InsertArticles, SelectArticles } from '../db/dev/schema';
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
	// clean-up article's content
	if (article.url?.startsWith('https://www.theatlantic.com')) {
		if (article.content?.startsWith(`<p>${article.excerpt}</p>`)) {
			article.content = article.content.replace(`<p>${article.excerpt}</p>\n`, '');
		}
		if (article.content?.startsWith(`<p><img`)) {
			const imagePattern = new RegExp(`<p><img[^<]*?<\\/p>\n<p>[^<]*?<\\/p>\n<p>[^<]*?<\\/p>`);
			article.content = article.content.replace(imagePattern, '');
		}
	}

	// generate complete HTML for article
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
	return html`<a href="/article/${article.id}">
		${
			article.lead_image_url
				? html`<img src="${article.lead_image_url}" alt="${article.lead_image_url}" />`
				: html`<img src="/public/image-not-found.jpg" alt="Image not found" />`
		}
			<h2>${article.title}</h2>
	</div>`;
	/*
	let html = '';
	html += `<h2>${article.title}</h2>`;
	if (article.excerpt) html += `<em>${article.excerpt}</em>`;
	if (article.author && article.date_published)
		html += `<h3>By ${article.author} on ${new Date(article.date_published).toLocaleDateString()}</h3>`;
	else if (article.author) html += `<h3>By ${article.author}</h3>`;
	else if (article.date_published) html += `<h4>On ${new Date(article.date_published).toLocaleDateString()}</h4>`;
	if (article.lead_image_url) html += `<img src="${article.lead_image_url}" alt="${article.lead_image_url}" />`;
	html += article.content;
	return html;
	*/
}
