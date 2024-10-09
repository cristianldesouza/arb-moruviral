import moment from 'moment-timezone';
import Template from '../models/Template';
import NotFound from './NotFound';
import Requests from '../models/Requests';
import constants from '../constants';

function topPostsRender(mainPost, otherPosts) {
	let items = '';

	for (let each of otherPosts) {
		items += Template.renderTemplate('home_top_posts_item', each);
	}

	return Template.renderTemplate('home_top_posts', { ...mainPost, items: items });
}

function mainCategoriesRender(posts) {
	let mainPost = posts[0];
	let items = '';

	for (let i = 1; i < posts.length; i++) {
		items += Template.renderTemplate('home_category_item', posts[i]);
	}

	return Template.renderTemplate('home_category', { ...mainPost, items: items });
}

function popularCategories(categories) {
	let items = '';

	for (let each of categories) {
		items += Template.renderTemplate('home_category_popular', each);
	}

	return items;
}

class Home {
	async handleHomeLang(lang, request, env, ctx) {
		let homeData = await Requests.getHomeData(lang, constants.DOMAIN);

		if (!homeData) {
			return NotFound.index(request, env, ctx);
		}

		for (let category of homeData.categories) {
			category.url =
				constants.LANGUAGES[0] == lang ? `/c/${category.slug}/` : `/${lang}/c/${category.slug}/`;

			for (let post of category.last_posts) {
				post.post_readtime = `${post.read_time} ${constants.READ_TIME[lang]}`;
				post.post_date = moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
					constants.DATE_FORMATS[lang]
				);
				post.category_name = category.name;
				post.category_slug = category.slug;

				post.category_url =
					constants.LANGUAGES[0] == lang
						? `/c/${post.category_slug}/`
						: `/${lang}/c/${post.category_slug}/`;

				post.post_url =
					constants.LANGUAGES[0] == lang ? `/p/${post.slug}/` : `/${lang}/p/${post.slug}/`;
			}
		}

		for (let post of homeData.posts) {
			post.post_readtime = `${post.read_time} ${constants.READ_TIME[lang]}`;
			post.post_date = moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
				constants.DATE_FORMATS[lang]
			);

			post.category_name = post.category.name;
			post.category_slug = post.category.slug;

			post.category_url =
				constants.LANGUAGES[0] == lang
					? `/c/${post.category_slug}/`
					: `/${lang}/c/${post.category_slug}/`;

			post.post_url =
				constants.LANGUAGES[0] == lang ? `/p/${post.slug}/` : `/${lang}/p/${post.slug}/`;
		}

		let header = Template.renderTemplate('header', {
			lang,
			menu: constants.MENU[lang],
			seo_title: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_description: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_image: `https://${constants.DOMAIN}/public/logo.svg`,
			seo_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

		let top_posts = topPostsRender(homeData.posts[0], homeData.posts.slice(1));

		let categories = '';

		for (let category of homeData.categories) {
			if (category.last_posts[0]) {
				categories += mainCategoriesRender(category.last_posts);
			}
		}

		let popular_categories = popularCategories(homeData.categories);

		let content = Template.renderTemplate('home_index', {
			top_posts,
			categories,
			popular_categories,
			readtime: constants.READ_TIME[lang],
			popular_categories_title: constants.POPULAR_CATEGORIES_TITLE[lang],
		});

		content = Template.searchAndReplace(content, '{{readtime}}', constants.READ_TIME[lang]);

		let footer = Template.renderTemplate('footer', {
			sitedomain: constants.DOMAIN,
			sitename: constants.SITE_NAME,
			site_description: constants.SITE_DESCRIPTION[lang],
			allrights: constants.ALL_RIGHTS[lang],
			year: new Date().getFullYear(),
			logourl: constants.LOGO_URL,
			footer_left_menu: constants.FOOTER_LEFT_MENU[lang],
			footer_right_menu: constants.FOOTER_RIGHT_MENU[lang],
			facebook: constants.SOCIAL_MEDIA.facebook,
			instagram: constants.SOCIAL_MEDIA.instagram,
		});

		let response = new Response(header + content + footer, {
			status: 200,
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, max-age=86400', // um dia de cache
			},
		});

		ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

		return response;
	}
}

export default new Home();
