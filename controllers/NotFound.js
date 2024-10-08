import Template from '../models/Template';
import constants from '../constants';

class Notfound {
	async index(request, env, ctx) {
		const thisUrl = new URL(request.url);
		const pathName = thisUrl.pathname;

		let header = Template.renderTemplate('header', {
			lang: constants.LANGUAGES[0],
			menu: constants.MENU[constants.LANGUAGES[0]],
			seo_title: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[constants.LANGUAGES[0]],
			seo_description: constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[constants.LANGUAGES[0]],
			seo_image: 'https://via.placeholder.com/1200x630',
			seo_url: `https://${constants.DOMAIN}${pathName}`,
			home_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

		let footer = Template.renderTemplate('footer', {
			sitedomain: constants.DOMAIN,
			sitename: constants.SITE_NAME,
			site_description: constants.SITE_DESCRIPTION[constants.LANGUAGES[0]],
			allrights: constants.ALL_RIGHTS[constants.LANGUAGES[0]],
			year: new Date().getFullYear(),
			logourl: constants.LOGO_URL,
			footer_left_menu: constants.FOOTER_LEFT_MENU[constants.LANGUAGES[0]],
			footer_right_menu: constants.FOOTER_RIGHT_MENU[constants.LANGUAGES[0]],
			facebook: constants.SOCIAL_MEDIA.facebook,
			instagram: constants.SOCIAL_MEDIA.instagram,
		});

		let content = Template.get('not_found');

		return new Response(header + content + footer, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	}
}

export default new Notfound();
