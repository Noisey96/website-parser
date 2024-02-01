// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';

export default async function parseService(url: string) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const markdown = (await Parser.parse(url, {
		contentType: 'markdown',
	})) as {
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

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const content = markdown.content;
	const contentHtml = marked.parse(content);

	let html = '';
	html += `<h2>${markdown.title}</h2>`;
	if (markdown.excerpt) html += `<em>${markdown.excerpt}</em>`;
	if (markdown.author && markdown.date_published)
		html += `<h3>By ${markdown.author} on ${new Date(markdown.date_published).toLocaleDateString()}</h3>`;
	else if (markdown.author) html += `<h3>By ${markdown.author}</h3>`;
	else if (markdown.date_published) html += `<h4>On ${new Date(markdown.date_published).toLocaleDateString()}</h4>`;
	if (markdown.lead_image_url) html += `<img src="${markdown.lead_image_url}" alt="${markdown.lead_image_url}" />`;
	html += contentHtml;

	return html;
}
