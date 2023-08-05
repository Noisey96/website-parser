// @ts-expect-error - no types
import Parser from '@postlight/parser';
import { marked } from 'marked';

export default async function parseService(url: string) {
	marked.use({
		mangle: false,
		headerIds: false,
	});

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

	// const markdown = testData;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const content = markdown.content;
	const contentHtml = marked.parse(content);

	let html = '';
	if (markdown.lead_image_url) html += `<img src="${markdown.lead_image_url}" alt="${markdown.lead_image_url}" />`;
	html += `<h2>${markdown.title}</h2>`;
	if (markdown.excerpt) html += `<p>${markdown.excerpt}</p>`;
	if (markdown.author) html += `<h3>${markdown.author}</h3>`;
	if (markdown.date_published) html += `<h4>${markdown.date_published}</h4>`;
	html += contentHtml;

	return html;
}

const testData = {
	title: 'The Businessmen Broke Hollywood',
	content:
		'The Hollywood machine—from script writing, to shooting and production, to late-night talk-show PR—has officially ground to a halt.\n' +
		'\n' +
		'On Thursday, [the actors went on strike](https://abcnews.go.com/US/sag-aftra-national-board-votes-approve-strike/story?id=101210303#:~:text=More%20than%20160%2C000%20members%20of,to%20hit%20the%20picket%20lines.). The 160,000 members of SAG-AFTRA, led by Fran Drescher, the fearless sitcom nanny, stopped working after talks with the studios collapsed. They join the ranks of the Writers Guild of America, whose members (myself included) have been on strike since May.\n' +
		'\n' +
		'Our two unions have not been on strike together since 1960. The writers’ pickets at shooting locations had already shut down an estimated 80 percent of productions. Now SAG’s strike rules dictate that actors not only can’t shoot or do voice-over work for productions; they also cannot attend red carpets or promote any Motion Picture Association projects—something that was already a challenge, given that the writers’ strike had shut down the nighttime talk shows that were such a staple of the press circuit.\n' +
		'\n' +
		'Much like the writers, actors are looking for increases in their residual pay—compensation that’s akin to royalty checks—once-reliable income that has all but vanished in the pivot to streaming. Actors are also seeking protections against artificial intelligence using their voice and image.\n' +
		'\n' +
		'[Xochitl Gonzalez: ‘The whole thing starts with us’](https://www.theatlantic.com/ideas/archive/2023/04/writers-guild-of-america-strike-residuals-pay-streaming/673876/)\n' +
		'\n' +
		'Bob Iger, Disney’s CEO, called these expectations “just not realistic.” He accused the strikers of “adding to a set of challenges that this business is already facing that is quite frankly very disruptive and dangerous.”\n' +
		'\n' +
		'This was a bit rich, coming days after a studio executive told [_Deadline_](https://deadline.com/2023/07/writers-strike-hollywood-studios-deal-fight-wga-actors-1235434335/) that their strategy was “to allow things to drag on until union members start losing their apartments and losing their houses.”\n' +
		'\n' +
		'Eviction is a pretty cruel labor-negotiation strategy.\n' +
		'\n' +
		'Hollywood’s CEOs _are_ suffering. Not primarily from labor disputes or industry disruption or public-relations issues, but from vincible ignorance, which seems to be endemic in C-suites of all industries. Under pressure to deliver to Wall Street, too many CEOs have lost the plot of their own movie. They are not running companies to profitably deliver a good product, such as a book or a cup of coffee or, in this case, a movie or TV show. They are running companies to deliver good profit. The quality of their product has ceased to matter.\n' +
		'\n' +
		'If you doubt this, consider that when Emmy nominations were announced last week, the lions’ share went to HBO Max, a prestige platform that has [ceased to exist by that name](https://www.insiderintelligence.com/content/charting-new-course-adapting-advertising-landscape-after-hbo-max-discovery-merger), because Warner Bros. Discovery took the streaming arm of the legacy brand and folded it into a messy app crowded with low-budget reality programs. We are in the upside-down.\n' +
		'\n' +
		'Writers and actors have been caught up in the pivot to streaming, the mad logic of which has [upended long-standing working practices](https://variety.com/2023/tv/news/writers-guild-contract-negotiation-mini-room-1235568173/), slowly begun to replace human instinct with [artificial intelligence](https://www.theverge.com/2019/5/28/18637135/hollywood-ai-film-decision-script-analysis-data-machine-learning), and obliterated workers’ income streams.\n' +
		'\n' +
		'The actor Mark Proksch, for example, made more money off residuals from one season of guest appearances on _The Office_, under the old system, than he has in five seasons of starring in _What We Do in the Shadows_, under the new system_._\n' +
		'\n' +
		'Now, just as Hollywood workers are arguing that we need to adjust our compensation models to fit the streaming era, the studios are telling us that we cannot be fairly paid, because the streaming model is broken. And we’re being told this by the very studio executives—many of them [multimillionaires](https://deadline.com/2023/05/ceo-pay-wga-writers-strike-1235351572/)—who broke it.\n' +
		'\n' +
		'This is another aspect of C-suite ignorance: Bonkers executive compensation has utterly detached leaders from the lives of the people they employ. The fact that David Zaslav, the CEO of Warner Bros. and Discovery, earned $247 million in 2021 makes it very hard to swallow his refusal to budge on issues that are costing middle-class actors thousands of dollars a year in lost income.\n' +
		'\n' +
		'You can argue all you like about whether anyone should ever earn this much, but these are leaders who have made some disastrous business decisions.\n' +
		'\n' +
		'The pivot to streaming was extremely profitable for the brief moment when everyone was trapped at home during a pandemic. People couldn’t spend money on concerts or eating out or traveling, so they felt comfortable spending an abnormal amount on streaming services.\n' +
		'\n' +
		'Hollywood CEOs saw the success of Netflix and raced to copy a model without knowing whether it was sustainable, a model that relied on the constant production of new (and costly) entertainment content created by unionized talent. They were wrong about the business, but they were even more wrong to presume that labor would comply. The actors and writers didn’t make this pivot; why should they pay the price?\n' +
		'\n' +
		'[Read: Why you should pay attention to the Hollywood writers’ strike](https://www.theatlantic.com/culture/archive/2023/05/hollywood-writers-strike-wga/673926/)\n' +
		'\n' +
		'If the pivot to streaming was such a mistake that these businesses truly are going under—a case that’s hard to make, given the size of these executives’ compensation packages—we will have to suffer too. But if we suffer during lean times, we should also share in the profits during fat ones. That is what the negotiations are about. The only way that executives will be able to right this ship is to return to making unmissable programming, and they won’t be able to do that without us.\n' +
		'\n' +
		'Absent good script writers, Hollywood executives have taken their lines from Marie Antoinette. But the revolutionaries are already outside, dismantling the palace. In London, the cast of _Oppenheimer_ [walked out](https://www.cbsnews.com/news/oppenheimer-stars-walk-out-london-premiere-actors-strike-emily-blunt-matt-damon-florence-pugh-cillian-murphy/) of the film’s premiere. Press tours for _Barbie_ have been halted; even the stars’ pink-laden social-media accounts have gone dark. The Emmys will likely be [postponed](https://www.nytimes.com/2023/06/21/business/media/emmy-awards-writers-strike.html). Comic-Con will be sans actors or writers. I am desperately hopeful that the studios will realize sooner rather than later that even if it hurts shareholders for a time, good entertainment, long-term, is always good business.',
	author: 'Xochitl Gonzalez',
	date_published: '2023-07-17T19:51:00.000Z',
	lead_image_url:
		'https://cdn.theatlantic.com/thumbor/jK8vxuTHwns5_x5nzOuIPlJR29o=/6x138:4798x2634/1200x625/media/img/mt/2023/07/hollywood_strike/original.jpg',
	dek: null,
	next_page_url: null,
	url: 'https://www.theatlantic.com/ideas/archive/2023/07/hollywoods-cruel-strategy/674730/',
	domain: 'www.theatlantic.com',
	excerpt: 'And now they don’t want to pay their employees.',
	word_count: 930,
	direction: 'ltr',
	total_pages: 1,
	rendered_pages: 1,
};
