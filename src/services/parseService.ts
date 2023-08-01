// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';
import xss from 'xss';

export default async function parseService(url: string) {
	marked.use({
		mangle: false,
		headerIds: false,
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const markdown = await Parser.parse(url, {
		contentType: 'markdown',
	});
	console.log(markdown);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const content = markdown.content as string;
	const contentHtml = marked.parse(content);
	// TBD - add title, author, date_published, lead_image_url, and excerpt to the HTML
	const parsedHtml = xss(contentHtml);
	return parsedHtml;
}
