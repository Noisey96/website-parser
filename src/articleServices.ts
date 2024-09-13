// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';

import { InsertArticles, SelectArticles } from '../db/dev/schema';

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

export function generateCompleteHtml(article: SelectArticles): string {
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
}

export function generateCardHtml(article: SelectArticles): string {
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
}
