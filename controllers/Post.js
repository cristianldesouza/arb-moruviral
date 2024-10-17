import moment from 'moment-timezone';
import Template from '../models/Template';
import Requests from '../models/Requests';
import constants from '../constants';
import Elements from '../models/Elements';
import NotFound from './NotFound';
import Util from '../models/Util';
import criticalCss from '../critical_post_css.txt';

class Post {
	async handleLang(lang, slug, request, env, ctx) {
		try {
			let postData = await Requests.getPostData(slug, lang, constants.DOMAIN);

			if (!postData) {
				return NotFound.index(lang, request, env, ctx);
			}

			let post = postData.post_data;
			let innerRelatedPost = postData.inner_related_posts;

			if (!post.content) {
				return NotFound.index(lang, request, env, ctx);
			}

			post.content = JSON.parse(post.content);
			let postReadTime = Util.getReadTime(post.content);

			post.content = Elements.convert(post.content);

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

			header = header.split('<!-- custom headers -->')
				.join(`<link rel="preload" as="image" href="${post.image}">
${criticalCss}`);

			post.category_url =
				constants.LANGUAGES[0] == lang
					? `/c/${post.category_slug}/`
					: `/${lang}/c/${post.category_slug}/`;

			post.author_url =
				constants.LANGUAGES[0] == lang
					? `/a/${post.author_slug}/`
					: `/${lang}/a/${post.author_slug}/`;

			post.published_date = moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
				constants.DATE_FORMATS[lang]
			);

			let content = Template.renderTemplate('post_index', post);

			for (let relatedPost of postData.related_posts) {
				relatedPost.category_name = post.category_name;
				relatedPost.category_slug = post.category_slug;
			}

			let replacesMap = {
				'{{pro_points_language}}': constants.PRO_POINTS_LANGUAGE[lang],
				'{{cons_points_language}}': constants.CONS_POINTS_LANGUAGE[lang],
				'{{langconfig.writtenby}}': constants.WRITTEN_BY[lang],
				'{{post_readtime}}': constants.READ_TIME[lang],
				'{{readtime}}': postReadTime,
				'{{sidebar}}': Template.lastPostsLoop(postData.last_posts, lang),
				'{{related}}': Template.relatedPostsLoop(postData.related_posts, lang),
			};

			for (let index in replacesMap) {
				content = Template.searchAndReplace(content, index, replacesMap[index]);
			}

			let ctaData = {
				text: post.cta_post,
				url: post.destination_url,
			};

			content = Template.insertAdsToPage(content);
			content = Template.injectCta(content, ctaData);

			if (postData.inner_related_posts) {
				content = content.replace(/\[related\]/g, function () {
					// Shift the first post from innerRelatedPosts and generate HTML
					const relatedPost = innerRelatedPost.shift();

					if (!relatedPost) {
						return '';
					}

					let innerContentHtml = Template.renderTemplate('related_inner_item', {
						read_also: constants.READ_ALSO[lang],
						title: relatedPost.title,
						thumbnail: Util.generateCdnUrl(relatedPost.image, 750, 450, 70),
						post_url:
							constants.LANGUAGES[0] == lang
								? `/p/${relatedPost.slug}/`
								: `/${lang}/p/${relatedPost.slug}/`,
					});

					return innerContentHtml;
				});
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

			footer = footer.replace(
				'<!-- custom script -->',
				`<script>document.querySelectorAll('.read-also-box').forEach(function (box) {
	box.addEventListener('click', function () {
		const postUrl = this.getAttribute('data-post-url');
		if (postUrl) {
			window.location.href = postUrl; // Redirect to post_url
		}
	});
});</script>`
			);
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

export default new Post();
