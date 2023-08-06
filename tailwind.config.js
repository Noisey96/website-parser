import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssTypography from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.ts'],
	theme: {
		fontFamily: {
			title: ['Rockwell', 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', 'serif'],
			body: [
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji',
			],
		},
		screens: {
			xs: '475px',
			...defaultTheme.screens,
		},
	},
	plugins: [tailwindcssTypography],
};
