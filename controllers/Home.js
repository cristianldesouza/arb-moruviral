import Template from '../models/Template';
import Requests from '../models/Requests';
import constants from '../constants';

const dummyData = {
	post_featured_image: 'https://example.com/images/featured-image.jpg',
	post_title: 'Como Aprender JavaScript em 30 Dias',
	post_url: 'https://example.com/posts/como-aprender-javascript',
	category_url: 'https://example.com/categories/programacao',
	category_title: 'Programação',
	post_date: '2024-10-02',
	post_readtime: '5 min',
};

const dummyCategoryData = {
	category_url: 'https://example.com/categories/saude',
	category_title: 'Saúde',
	category_image: 'https://via.placeholder.com/150', // URL de imagem de placeholder
};

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
		let k = await Requests.list();

		let header = Template.renderTemplate('header', {
			lang,
			menu: constants.MENU[lang],
			seo_title: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_description: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_image: 'https://via.placeholder.com/1200x630',
			seo_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

		let top_posts = topPostsRender(dummyData, [
			dummyData,
			dummyData,
			dummyData,
			dummyData,
			dummyData,
		]);

		let categories = mainCategoriesRender([dummyData, dummyData, dummyData, dummyData, dummyData]);
		categories += mainCategoriesRender([dummyData, dummyData, dummyData, dummyData, dummyData]);
		categories += mainCategoriesRender([dummyData, dummyData, dummyData, dummyData, dummyData]);
		categories += mainCategoriesRender([dummyData, dummyData, dummyData, dummyData, dummyData]);

		let popular_categories = popularCategories([
			dummyCategoryData,
			dummyCategoryData,
			dummyCategoryData,
			dummyCategoryData,
			dummyCategoryData,
		]);

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
