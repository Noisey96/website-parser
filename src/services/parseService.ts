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

	console.log(markdown);

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

/*
const testData = {
  title: 'How America Got Mean',
  content: '![Mirror shards arranged in the shape of the United States, reflecting a tree and the sky](https://cdn.theatlantic.com/thumbor/ErwHrDisYTvej8Qd9FpdaGlQsAI=/0x157:3000x1845/1440x810/media/img/2023/07/24/0923_WEL_Brooks_MoralCollapseOpener/original.jpg)\n' +
    '\n' +
    'In a culture devoid of moral education, generations are growing up in a morally inarticulate, self-referential world.\n' +
    '\n' +
    'By [David Brooks](https://www.theatlantic.com/author/david-brooks/)\n' +
    '\n' +
    'Illustrations by Ricardo Tomás\n' +
    '\n' +
    '![Mirror shards arranged in the shape of the United States, reflecting a tree and the sky](https://cdn.theatlantic.com/thumbor/TwtZWeXuXfOJmET-u7ZNeFNTR7Q=/174x144:2784x2754/80x80/media/img/2023/07/0923_WEL_Brooks_MoralCollapseOpenerHP/original.png)\n' +
    '\n' +
    'Listen to this article\n' +
    '\n' +
    'Listen to more stories on [curio](https://curio.io/l/66v0gi9v?fw=1)\n' +
    '\n' +
    '_This article was featured in One Story to Read Today, a newsletter in which our editors recommend a single must-read from_ The Atlantic_, Monday through Friday._ _[Sign up for it here.](https://www.theatlantic.com/newsletters/sign-up/one-story-to-read-today/)_\n' +
    '\n' +
    'Over the past eight years or so, I’ve been obsessed with two questions. The first is: Why have Americans become so sad? The rising rates of depression have been well publicized, as have the rising deaths of despair from drugs, alcohol, and suicide. But other statistics are similarly troubling. The percentage of people who say they don’t have close friends has increased fourfold since 1990. The share of Americans ages 25 to 54 who weren’t married or living with a romantic partner went up to 38 percent in 2019, from 29 percent in 1990. A record-high 25 percent of 40-year-old Americans [have never married](https://www.pewresearch.org/short-reads/2023/06/28/a-record-high-share-of-40-year-olds-in-the-us-have-never-been-married/). More than half of all Americans say that no one knows them well. The percentage of high-school students who report “persistent feelings of sadness or hopelessness” shot up from 26 percent in 2009 to 44 percent in 2021.\n' +
    '\n' +
    '[![Magazine Cover image](https://cdn.theatlantic.com/thumbor/6BfzOiSeUxgWHz_b8vK2MAn3nJM=/15x0:2348x3150/80x108/media/img/issues/2023/08/15/0923_Cover/original.jpg)](https://www.theatlantic.com/magazine/toc/2023/09/)\n' +
    '\n' +
    'Check out more from this issue and find your next story to read.\n' +
    '\n' +
    '[View More](https://www.theatlantic.com/magazine/toc/2023/09/)\n' +
    '\n' +
    'My second, related question is: Why have Americans become so mean? I was recently talking with a restaurant owner who said that he has to eject a customer from his restaurant for rude or cruel behavior once a week—something that never used to happen. A head nurse at a hospital told me that many on her staff are leaving the profession because patients have become so abusive. At the far extreme of meanness, hate crimes rose in 2020 to their highest level in 12 years. Murder rates have been surging, at least until recently. Same with gun sales. Social trust is plummeting. In 2000, two-thirds of American households gave to charity; in 2018, fewer than half did. The words that define our age reek of menace: _conspiracy_, _polarization_, _mass shootings_, _trauma_, _safe spaces_.\n' +
    '\n' +
    'We’re enmeshed in some sort of emotional, relational, and spiritual crisis, and it undergirds our political dysfunction and the general crisis of our democracy. What is going on?\n' +
    '\n' +
    'Over the past few years, different social observers have offered different stories to explain the rise of hatred, anxiety, and despair.\n' +
    '\n' +
    '_The technology story:_ Social media is driving us all crazy.\n' +
    '\n' +
    '_The sociology story:_ We’ve stopped participating in community organizations and are more isolated.\n' +
    '\n' +
    '_The demography story:_ America, long a white-dominated nation, is becoming a much more diverse country, a change that has millions of white Americans in a panic.\n' +
    '\n' +
    '_The economy story:_ High levels of economic inequality and insecurity have left people afraid, alienated, and pessimistic.\n' +
    '\n' +
    'I agree, to an extent, with all of these stories, but I don’t think any of them is the deepest one. Sure, social media has bad effects, but it is everywhere around the globe—and the mental-health crisis is not. Also, the rise of despair and hatred has engulfed a lot of people who are not on social media. Economic inequality is real, but it doesn’t fully explain this level of social and emotional breakdown. The sociologists are right that we’re more isolated, but why? What values lead us to choose lifestyles that make us lonely and miserable?\n' +
    '\n' +
    'The most important story about why Americans have become sad and alienated and rude, I believe, is also the simplest: We inhabit a society in which people are no longer trained in how to treat others with kindness and consideration. Our society has become one in which people feel licensed to give their selfishness free rein. The story I’m going to tell is about morals. In a healthy society, a web of institutions—families, schools, religious groups, community organizations, and workplaces—helps form people into kind and responsible citizens, the sort of people who show up for one another. We live in a society that’s terrible at moral formation.\n' +
    '\n' +
    '[Read: American shoppers are a nightmare](https://www.theatlantic.com/health/archive/2021/08/pandemic-american-shoppers-nightmare/619650/)\n' +
    '\n' +
    'Moral formation, as I will use that stuffy-sounding term here, comprises three things. First, helping people learn to restrain their selfishness. How do we keep our evolutionarily conferred egotism under control? Second, teaching basic social and ethical skills. How do you welcome a neighbor into your community? How do you disagree with someone constructively? And third, helping people find a purpose in life. Morally formative institutions hold up a set of ideals. They provide practical pathways toward a meaningful existence: _Here’s how you can dedicate your life to serving the poor, or protecting the nation, or loving your neighbor._\n' +
    '\n' +
    'For a large part of its history, America was awash in morally formative institutions. Its Founding Fathers had a low view of human nature, and [designed the Constitution to mitigate it](https://guides.loc.gov/federalist-papers/text-51-60) (even while validating that low view of human nature by producing a document rife with racism and sexism). “Men I find to be a Sort of Beings very badly constructed,” [Benjamin Franklin wrote](https://founders.archives.gov/documents/Franklin/01-37-02-0277), “as they are generally more easily provok’d than reconcil’d, more dispos’d to do Mischief to each other than to make Reparation, and much more easily deceiv’d than undeceiv’d.”\n' +
    '\n' +
    'If such flawed, self-centered creatures were going to govern themselves and be decent neighbors to one another, they were going to need some training. For roughly 150 years after the founding, Americans were obsessed with moral education. In 1788, Noah Webster wrote, “The _virtues_ of men are of more consequence to society than their _abilities_ ; and for this reason, the _heart_ should be cultivated with more assiduity than the _head_.” The progressive philosopher John Dewey wrote in 1909 that schools teach morality “every moment of the day, five days a week.” Hollis Frissell, the president of the Hampton Institute, an early school for African Americans, declared, “Character is the main object of education.” As late as 1951, a commission organized by the National Education Association, one of the main teachers’ unions, stated that “an unremitting concern for moral and spiritual values continues to be a top priority for education.”\n' +
    '\n' +
    'The moral-education programs that stippled the cultural landscape during this long stretch of history came from all points on the political and religious spectrums. School textbooks such as _McGuffey’s Eclectic Readers_ not only taught students how to read and write; they taught etiquette, and featured stories designed to illustrate right and wrong behavior. In the 1920s, W. E. B. Du Bois’s [magazine for Black children](https://blogs.loc.gov/loc/2022/08/w-e-b-dubois-and-the-brownies-book/), _The Brownies’ Book_, had a regular column called “The Judge,” which provided guidance to young readers on morals and manners. There were thriving school organizations with morally earnest names that sound quaint today—the Courtesy Club, the Thrift Club, the Knighthood of Youth.\n' +
    '\n' +
    'Beyond the classroom lay a host of other groups: the YMCA; the Sunday-school movement; the Boy Scouts and Girl Scouts; the settlement-house movement, which brought rich and poor together to serve the marginalized; Aldo Leopold’s land ethic, which extended our moral concerns to include proper care for the natural world; professional organizations, which enforced ethical codes; unions and workplace associations, which, in addition to enhancing worker protections and paychecks, held up certain standards of working-class respectability. And of course, by the late 19th century, many Americans were members of churches or other religious communities. Mere religious faith doesn’t always make people morally good, but living in a community, orienting your heart toward some transcendent love, basing your value system on concern for the underserved—those things tend to.\n' +
    '\n' +
    '[Arthur C. Brooks: Make yourself happy—be kind](https://www.theatlantic.com/ideas/archive/2023/04/kindness-happiness-negative-feedback/673862/)\n' +
    '\n' +
    'An educational approach with German roots that was adopted by Scandinavian societies in the mid-to-late 19th century had a wide influence on America. It was called _Bildung_, roughly meaning “spiritual formation.” As conceived by Wilhelm von Humboldt, the _Bildung_ approach gave professors complete freedom to put moral development at the center of a university’s mission. In schools across Scandinavia, students studied literature and folk cultures to identify their own emotions, wounds, and weaknesses, in order to become the complex human beings that modern society required. Schools in the _Bildung_ tradition also aimed to clarify the individual’s re'... 34366 more characters,
  author: 'David Brooks',
  date_published: '2023-08-14T10:00:00.000Z',
  lead_image_url: 'https://cdn.theatlantic.com/thumbor/S6UNtkLH2SIxLSK61xddj4lpv_M=/0x720:2995x2280/1200x625/media/img/2023/07/0923_WEL_Brooks_MoralCollapseOpenerHP/original.png',
  dek: null,
  next_page_url: null,
  url: 'https://www.theatlantic.com/magazine/archive/2023/09/us-culture-moral-education-formation/674765/',
  domain: 'www.theatlantic.com',
  excerpt: 'In a culture devoid of moral education, generations are growing up in a morally inarticulate, self-referential world.',
  word_count: 6553,
  direction: 'ltr',
  total_pages: 1,
  rendered_pages: 1
}
*/
