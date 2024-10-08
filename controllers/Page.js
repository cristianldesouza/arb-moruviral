import Template from '../models/Template';
import Requests from '../models/Requests';
import constants from '../constants';
import Elements from '../models/Elements';
import NotFound from './NotFound';
import Contact from './Contact';

class Page {
	async handleLang(lang, slug, request, env, ctx) {
		if (slug == 'contact') {
			return Contact.handleLang(lang, request, env, ctx);
		}

		let pageData = await Requests.getPageData(slug, lang, constants.DOMAIN);

		if (!pageData) {
			return NotFound.index(request, env, ctx);
		}

		let page = pageData.page_data;

		if (!page.content) {
			return NotFound.index(request, env, ctx);
		}

		page.content = JSON.parse(page.content);
		page.content = Elements.convert(page.content);

		const thisUrl = new URL(request.url);
		const pathName = thisUrl.pathname;

		let header = Template.renderTemplate('header', {
			lang,
			menu: constants.MENU[lang],
			seo_title: page.seo_title || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_description:
				page.seo_description || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_image: page.seo_image || page.avatar || '',
			seo_url: `https://${constants.DOMAIN}${pathName}`,
			home_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

		let content = Template.renderTemplate('page_index', page);

		let replacesMap = {
			'{{pro_points_language}}': constants.PRO_POINTS_LANGUAGE[lang],
			'{{cons_points_language}}': constants.CONS_POINTS_LANGUAGE[lang],
			'{{sidebar}}': Template.lastPostsLoop(pageData.last_posts, lang),
		};

		for (let index in replacesMap) {
			content = Template.searchAndReplace(content, index, replacesMap[index]);
		}

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

export default new Page();
