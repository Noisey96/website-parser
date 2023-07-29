// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';
import xss from 'xss';

const result = await Parser.parse(
	'https://www.theatlantic.com/ideas/archive/2023/07/hollywoods-cruel-strategy/674730/',
	{
		contentType: 'markdown',
	},
);
const content = result.content as string;
const html = xss(marked.parse(content));
console.log(html);
