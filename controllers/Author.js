import Template from '../models/Template';
import Requests from '../models/Requests';
import constants from '../constants';
import Elements from '../models/Elements';
import NotFound from './NotFound';
import Util from '../models/Util';

class Author {
	async handleLang(lang, slug, page, request, env, ctx) {
		let authorData = await Requests.getAuthorData(slug, lang, constants.DOMAIN, page);

		if (!authorData) {
			return NotFound.index(request, env, ctx, lang);
		}

		let author = authorData.author_data;

		const thisUrl = new URL(request.url);
		const pathName = thisUrl.pathname;

		let seoImage = author.seo_image || author.avatar || false;

		let header = Template.renderTemplate('header', {
			lang,
			menu: constants.MENU[lang],
			seo_title: author.seo_title || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_description:
				author.seo_description || constants.SITE_NAME + ' - ' + constants.SITE_SLOGAN[lang],
			seo_image: seoImage
				? Util.generateCdnUrl(seoImage, 750, 450, 70)
				: `https://${constants.DOMAIN}/public/logo.svg`,
			seo_url: `https://${constants.DOMAIN}${pathName}`,
			home_url:
				lang === constants.LANGUAGES[0]
					? 'https://' + constants.DOMAIN + '/'
					: 'https://' + constants.DOMAIN + '/' + lang + '/',
		});

		author.bio = JSON.parse(author.bio);
		author.bio = Elements.convert(author.bio);
		author.avatar = Util.generateCdnUrl(author.avatar, 100, 100, 70);

		let content = Template.renderTemplate('author_index', author);

		if (author.social_media) {
			author.social_media = JSON.parse(author.social_media);
		}

		let replacesMap = {
			'{{sidebar}}': Template.lastPostsLoop(authorData.last_posts, lang),
			'{{author.posts}}': Template.authorPostsLoop(authorData.posts, lang),
			'{{pagination}}': Template.renderPagination(authorData.pagination, lang, `a/${slug}`),
			'{{socialmedia}}': Template.authorSocialMediaLoop(author.social_media),
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
				'Cache-Control': `public, max-age=${constants.CACHE_CONTROL_TIME}`,
			},
		});

		ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

		return response;
	}

	async authorsListLang(lang, request, env, ctx) {
		try {
			// 1. Fetch authors list data
			const authorsListData = await Requests.getAuthorsListData(lang);

			// 2. Handle missing data
			if (!authorsListData || !authorsListData.authors || authorsListData.authors.length === 0) {
				return NotFound.index(lang, request, env, ctx);
			}

			// 3. Prepare header with SEO data
			const thisUrl = new URL(request.url);
			const pathName = thisUrl.pathname;

			let header = Template.renderTemplate('header', {
				lang,
				menu: constants.MENU[lang],
				seo_title:
					authorsListData.seo_title ||
					`${constants.SITE_NAME} - ${constants.SITE_SLOGAN[lang]}`,
				seo_description:
					authorsListData.seo_description ||
					`${constants.SITE_NAME} - ${constants.SITE_SLOGAN[lang]}`,
				seo_image: authorsListData.seo_image || '',
				seo_url: `https://${constants.DOMAIN}${pathName}`,
				home_url:
					lang === constants.LANGUAGES[0]
						? `https://${constants.DOMAIN}/`
						: `https://${constants.DOMAIN}/${lang}/`,
			});

			// 4. Process authors data
			const authors = authorsListData.authors
				.map((author) => {
					// Ensure bio is parsed and generate minibio (first 100 characters)

					return Template.renderTemplate('authors_card', {
						'author.url':
							lang == constants.LANGUAGES[0]
								? `/a/${author.slug}/`
								: `/${lang}/a/${author.slug}/`,
						'author.img': Util.generateCdnUrl(author.avatar, 100, 100, 70),
						'author.name': author.name,
						'author.minibio': author.short_bio,
					});
				})
				.join('');

			// 6. Render main content template
			let content = Template.renderTemplate('authors_index', {
				'authors.title': constants.AUTHORS_LIST_TITLE[lang],
				authors: authors,
				sidebar: Template.lastPostsLoop(authorsListData.last_posts, lang),
			});

			// 7. Render footer
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

			// 8. Create and return response
			let response = new Response(header + content + footer, {
				status: 200,
				headers: {
					'Content-Type': 'text/html',
					'Cache-Control': `public, max-age=${constants.CACHE_CONTROL_TIME}`,
				},
			});

			// 9. Cache the response
			ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

			return response;
		} catch (error) {
			console.error('Error in authorsListLang handler:', error);
			return NotFound.index(lang, request, env, ctx);
		}
	}
}

export default new Author();
