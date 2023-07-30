// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';
import xss from 'xss';

export default async function parseService(url: string) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const markdown = await Parser.parse(url, {
		contentType: 'markdown',
	});
	const html = xss(marked.parse(markdown.content));
	return html;
}
