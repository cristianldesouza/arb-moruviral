import Template from '../models/Template';
import constants from '../constants';

class Notfound {
	async index(lang, request, env, ctx) {
		const thisUrl = new URL(request.url);
		const pathName = thisUrl.pathname;

		let header = Template.renderTemplate('header', {
			lang,
			menu: constants.MENU[lang],
			seo_title: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_description: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_image: `https://${constants.DOMAIN}/public/img/logo.svg`,
			seo_url: `https://${constants.DOMAIN}${pathName}`,
			home_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

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

		let content = Template.renderTemplate('not_found', {
			title: constants.NOT_FOUND[lang].TITLE,
			text: constants.NOT_FOUND[lang].TEXT,
		});

		return new Response(header + content + footer, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	}
}

export default new Notfound();
