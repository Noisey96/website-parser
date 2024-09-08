// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';

type Article = {
	author: string | null;
	content: string;
	date_published: string | null;
	dek: string | null;
	direction: string;
	domain: string;
	excerpt: string | null;
	lead_image_url: string | null;
	next_page_url: string | null;
	rendered_pages: number;
	title: string;
	total_pages: number;
	url: string;
	word_count: number;
};

export async function parseArticle(url: string): Promise<Article> {
	const article = (await Parser.parse(url, {
		contentType: 'markdown',
	})) as Article;

	const content = article.content;
	const contentHtml = await marked.parse(content);
	// TODO: parse HTML to be safe
	article.content = contentHtml;

	return article;
}

export function generateHtml(article: Article): string {
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
