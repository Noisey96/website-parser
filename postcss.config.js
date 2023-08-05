import 'dotenv/config';

export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		...(process.env.ENVIRONMENT === 'prd' ? { cssnano: {} } : {}),
	},
};
