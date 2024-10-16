import Template from '../models/Template';
import Requests from '../models/Requests';
import constants from '../constants';
import Elements from '../models/Elements';
import NotFound from './NotFound';
import Util from '../models/Util';

class Landing {
	async handleLang(lang, slug, request, env, ctx) {
		try {
			let postData = await Requests.getLandingData(slug, lang, constants.DOMAIN);

			if (!postData) {
				return NotFound.index(lang, request, env, ctx);
			}

			let post = postData.post_data;

			if (!post.content) {
				return NotFound.index(lang, request, env, ctx);
			}

			if (post.type_id == 4) {
				return Response.redirect(request.url.replace('/l/', '/p/'), 301);
			}

			post.content = JSON.parse(post.content);

			let benefitsItem = false;
			let prosAndCons = false;

			for (let each of post.content) {
				if (each.type == 'benefitsList') {
					benefitsItem = [each];
				} else if (each.type == 'proConList') {
					prosAndCons = [each];
				}
			}

			benefitsItem = benefitsItem ? Elements.convert(benefitsItem, true) : '';
			prosAndCons = prosAndCons ? Elements.convert(prosAndCons, true) : '';

			const thisUrl = new URL(request.url);
			const pathName = thisUrl.pathname;

			let seoImage = post.seo_image || post.image || false;

			let header = Template.renderTemplate('header', {
				lang,
				menu: constants.MENU[lang],
				seo_title: post.seo_title || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
				seo_description:
					post.seo_description || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
				seo_image: seoImage
					? Util.generateCdnUrl(seoImage, 750, 450, 70)
					: `https://${constants.DOMAIN}/public/img/logo.svg`,
				seo_url: `https://${constants.DOMAIN}${pathName}`,
				home_url:
					lang === constants.LANGUAGES[0]
						? 'https://' + constants.DOMAIN + '/'
						: 'https://' + constants.DOMAIN + '/' + lang + '/',
			});

			post.image = Util.generateCdnUrl(post.image, 750, 450, 70);

			header = header
				.split('<!-- custom headers -->')
				.join(`<link rel="preload" as="image" href="${post.image}">`);

			post.category_url =
				constants.LANGUAGES[0] == lang
					? `/c/${post.category_slug}/`
					: `/${lang}/c/${post.category_slug}/`;

			let content = Template.renderTemplate('landing_index', post);

			let replacesMap = {
				'{{pro_points_language}}': constants.PRO_POINTS_LANGUAGE[lang],
				'{{cons_points_language}}': constants.CONS_POINTS_LANGUAGE[lang],
				'{{benefitsItem}}': benefitsItem,
				'{{prosAndCons}}': prosAndCons,
			};

			for (let index in replacesMap) {
				content = Template.searchAndReplace(content, index, replacesMap[index]);
			}

			post.destination_url =
				lang == constants.LANGUAGES[0] ? `/p/${post.slug}/` : `/${lang}/p/${slug}/`;

			let ctaData = {
				text: post.cta_pouso,
				url: post.destination_url,
			};

			content = Template.insertAdsToPage(content);
			content = Template.injectCta(content, ctaData);

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
					'Cache-Control': `public, max-age=${constants.CACHE_CONTROL_TIME}`,
				},
			});

			ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

			return response;
		} catch (e) {
			return NotFound.index(lang, request, env, ctx);
		}
	}
}

export default new Landing();
