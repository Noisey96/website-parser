# Website Parser

## What is this?

With this website, you enter a URL, and you receive either an error or the contents to the inputted URL.

Behind the scenes, the application is a [Hono](https://hono.dev/) server that serves HTML permeated with [HTMX](https://htmx.org/) and [Tailwind CSS](https://tailwindcss.com/). [HTMX](https://htmx.org/) and [Tailwind CSS](https://tailwindcss.com/) enable client-side validation, while [Hono](https://hono.dev/) and [Zod](https://zod.dev/) enable server-side validation. Lastly, [Postlight/Parser](https://www.npmjs.com/package/@postlight/parser), [Marked](https://marked.js.org/), and [XSS](https://www.npmjs.com/package/xss) allow the website to return the contents to the inputted URL.

## Can you show me how the website works?

Here is the workflow to the website.

1. Enter a URL complete with a protocol.
   <br>
   <img alt="Home page with a URL entered in" src="https://utfs.io/f/b6d60155-43ef-4d42-ad37-8aa8afca0080_demo-1.png">

2. Either you receive an error where you can click Back to go back home...
   <br>
   <img alt="Error page with a back button" src="https://utfs.io/f/5d4a235e-043b-47aa-b38f-7511a54e5034_demo-2.png">

3. Or you receive the contents to the inputted URL where you can click Back to go back home.
   <br>
   <img alt="Page showing the inputted URL's contents with a back button" src="https://utfs.io/f/79ca2e76-0a3c-4fba-87c3-0b0cb5710017_demo-3.png">

## How can I recreate this website?

1. Clone the repo.
2. Run _pnpm install_.
3. Setup a project with [Sentry](https://sentry.io/) and add its DSN to an .env file.

## Where will this go?

Honestly, this website is almost done. At the moment, the website is not accessible. There are changes to be made to make the website accessible.

## Credits

For this website, here are the resources and tools I used the most:

-   [Hono](https://hono.dev/)
-   [Hono + htmx + Cloudflare is a new stack](https://blog.yusu.ke/hono-htmx-cloudflare/)
-   [HTMX](https://htmx.org/)
-   [Postlight/Parser](https://www.npmjs.com/package/@postlight/parser)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [TypeScript](https://www.typescriptlang.org/)
