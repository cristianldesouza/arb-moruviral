import constants from '../constants';
import moment from 'moment-timezone';
import Util from './Util';

import header from '../templates/header.html';
import footer from '../templates/footer.html';
import preloader from '../templates/ads/preloader.html';
import ad_top from '../templates/ads/top.html';
import ad_mid from '../templates/ads/mid.html';
import not_found from '../templates/404.html';
import contact_index from '../templates/contact/index.html';
import cta from '../templates/elements/cta.html';

// side bar templates
import sidebar_index from '../templates/sidebar/index.html';
import sidebar_item from '../templates/sidebar/item.html';

// related templtes
import related_index from '../templates/related/index.html';
import related_item from '../templates/related/item.html';
import related_inner_item from '../templates/related/inner-item.html';

// home templates
import home_index from '../templates/home/index.html';
import home_category from '../templates/home/category.html';
import home_category_item from '../templates/home/category-item.html';
import home_category_popular from '../templates/home/popular-category.html';
import home_top_posts from '../templates/home/top-posts.html';
import home_top_posts_item from '../templates/home/top-posts-item.html';

// post templates
import post_index from '../templates/post/index.html';

// landing templates
import landing_index from '../templates/landing/index.html';

// category templates
import category_index from '../templates/category/index.html';
import category_posts_index from '../templates/category/posts.html';
import category_posts_item from '../templates/category/item.html';

// author templates
import author_index from '../templates/author/index.html';
import author_social_medias from '../templates/author/social-media.html';
import author_posts_list from '../templates/author/posts.html';
import author_posts_item from '../templates/author/item.html';
import authors_index from '../templates/author/list.html';
import authors_card from '../templates/author/author-item.html';

// page templates
import page_index from '../templates/static/index.html';

// aggregators templates
import aggregator_index from '../templates/aggregator/index.html';
import aggregator_post from '../templates/aggregator/post.html';

const templates = Object.freeze({
	header,
	footer,
	ad_top,
	ad_mid,
	preloader,
	cta,
	not_found,
	contact_index,
	sidebar_index,
	sidebar_item,
	related_inner_item,
	related_index,
	related_item,
	home_index,
	home_category,
	home_category_item,
	home_category_popular,
	home_top_posts,
	home_top_posts_item,
	post_index,
	landing_index,
	category_index,
	category_posts_index,
	category_posts_item,
	author_index,
	author_social_medias,
	author_posts_list,
	author_posts_item,
	authors_index,
	authors_card,
	page_index,
	aggregator_index,
	aggregator_post,
});

class Template {
	get(file, replaces = []) {
		let k = templates[file];

		for (let each of replaces) {
			k = k.split(each.search).join(each.replace);
		}

		return k;
	}

	renderTemplate(template, values) {
		return templates[template].replace(/{{(.*?)}}/g, (_, key) => {
			const trimmedKey = key.trim();
			return trimmedKey in values ? values[trimmedKey] : `{{${trimmedKey}}}`;
		});
	}

	searchAndReplace(template, search, replace) {
		return template.replace(new RegExp(search, 'g'), replace);
	}

	insertAdsToPage(html) {
		let ads = {
			'<p>{ad_top}</p>': templates.ad_top,
			'<p>{ad_mid}</p>': templates.ad_mid,
			'[ad]': templates.ad_mid,
			'<p>{ad}</p>': templates.ad_mid,
			'<p style="margin-left:0px;">{ad}</p>': templates.ad_mid,
		};

		for (let ad in ads) {
			html = html.split(ad).join(ads[ad]);
		}

		return html;
	}

	lastPostsLoop(lastPosts, lang) {
		let container = templates.sidebar_index.split('{title}').join(constants.SIDEBAR_TITLE[lang]);
		let itemsHtml = [];

		for (let post of lastPosts) {
			let attrs = {
				'{post.url}':
					lang !== constants.LANGUAGES[0] ? `/${lang}/p/${post.slug}/` : `/p/${post.slug}/`,
				'{post.title}': post.title,
				'{post.thumbnail}': Util.generateCdnUrl(post.image, 112, 96, 70),
				'{category.url}':
					lang !== constants.LANGUAGES[0]
						? `/${lang}/c/${post.category_slug}/`
						: `/c/${post.category_slug}/`,
				'{category.title}': post.category_name,
				'{post.date}': moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
					constants.DATE_FORMATS[lang]
				),
				'{post.readtime}': Util.getReadTime(JSON.parse(post.content)),
				'{langconfig.readtime}': constants.READ_TIME[lang],
			};

			let thisItem = templates.sidebar_item;

			for (let attr in attrs) {
				thisItem = thisItem.split(attr).join(attrs[attr]);
			}

			itemsHtml.push(thisItem);
		}

		container = container.split('{items}').join(itemsHtml.join(''));

		return container;
	}

	relatedPostsLoop(relatedPosts, lang) {
		let container = templates.related_index.split('{title}').join(constants.RELATED_TITLE[lang]);
		let itemsHtml = [];

		for (let post of relatedPosts) {
			let attrs = {
				'{post.url}':
					lang !== constants.LANGUAGES[0] ? `/${lang}/p/${post.slug}/` : `/p/${post.slug}/`,
				'{post.title}': post.title,
				'{post.thumbnail}': Util.generateCdnUrl(post.image, 400, 160, 70),
				'{category.url}':
					lang !== constants.LANGUAGES[0]
						? `/${lang}/c/${post.category_slug}/`
						: `/c/${post.category_slug}/`,
				'{category.title}': post.category_name,
				'{post.date}': moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
					constants.DATE_FORMATS[lang]
				),
				'{post.readtime}': Util.getReadTime(JSON.parse(post.content)),
				'{langconfig.readtime}': constants.READ_TIME[lang],
			};

			let thisItem = templates.related_item;

			for (let attr in attrs) {
				thisItem = thisItem.split(attr).join(attrs[attr]);
			}

			itemsHtml.push(thisItem);
		}

		container = container.split('{items}').join(itemsHtml.join(''));

		return container;
	}

	categoriesPostsLoop(categoryPosts, lang) {
		let container = templates.category_posts_index
			.split('{title}')
			.join(constants.RELATED_TITLE[lang]);
		let itemsHtml = [];

		for (let post of categoryPosts) {
			let attrs = {
				'{post.url}':
					lang !== constants.LANGUAGES[0] ? `/${lang}/p/${post.slug}/` : `/p/${post.slug}/`,
				'{post.title}': post.title,
				'{post.featured_image}': Util.generateCdnUrl(post.image, 360, 220, 70),
				'{category.url}':
					lang !== constants.LANGUAGES[0]
						? `/${lang}/c/${post.category_slug}/`
						: `/c/${post.category_slug}/`,
				'{category.title}': post.category_name,
				'{post.date}': moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
					constants.DATE_FORMATS[lang]
				),
				'{post.readtime}': Util.getReadTime(JSON.parse(post.content)),
				'{langconfig.readtime}': constants.READ_TIME[lang],
			};

			let thisItem = templates.category_posts_item;

			for (let attr in attrs) {
				thisItem = thisItem.split(attr).join(attrs[attr]);
			}

			itemsHtml.push(thisItem);
		}

		container = container.split('{items}').join(itemsHtml.join(''));

		return container;
	}

	authorSocialMediaLoop(socialMedias) {
		let content = [];

		for (let socialMedia of socialMedias) {
			let attrs = {
				'{social-media}': socialMedia.url,
				'{svg.icon}': socialMedia.icon,
			};

			let thisItem = templates.author_social_medias;

			for (let attr in attrs) {
				thisItem = thisItem.split(attr).join(attrs[attr]);
			}

			content.push(thisItem);
		}

		return content.join('');
	}

	authorPostsLoop(authorPosts, lang) {
		let container = templates.author_posts_list;
		let itemsHtml = [];

		for (let post of authorPosts) {
			let attrs = {
				'{post.url}':
					lang !== constants.LANGUAGES[0] ? `/${lang}/p/${post.slug}/` : `/p/${post.slug}/`,
				'{post.title}': post.title,
				'{post.thumbnail}': Util.generateCdnUrl(post.image, 360, 220, 70),
				'{category.url}':
					lang !== constants.LANGUAGES[0]
						? `/${lang}/c/${post.category_slug}/`
						: `/c/${post.category_slug}/`,
				'{category.title}': post.category_name,
				'{post.date}': moment(post.published_date, 'YYYY-MM-DD HH:mm').format(
					constants.DATE_FORMATS[lang]
				),
				'{post.readtime}': Util.getReadTime(JSON.parse(post.content)),
				'{langconfig.readtime}': constants.READ_TIME[lang],
			};

			let thisItem = templates.author_posts_item;

			for (let attr in attrs) {
				thisItem = thisItem.split(attr).join(attrs[attr]);
			}

			itemsHtml.push(thisItem);
		}

		container = container.split('{items}').join(itemsHtml.join(''));

		return container;
	}

	renderPagination(pagination, lang, pathName) {
		const { current_page, total_pages } = pagination;
		const isDefaultLang = lang === constants.LANGUAGES[0];
		const previousText = constants.PAGINATION.PREVIOUS[lang];
		const nextText = constants.PAGINATION.NEXT[lang];

		const baseUrl = isDefaultLang ? `/${pathName}/` : `/${lang}/${pathName}/`;

		// If there's only one page, display only the current page
		if (total_pages <= 1) {
			return `
			<div class="pagination">
				<div class="page page--current"><span>${current_page}</span></div>
			</div>`;
		}

		let paginationHTML = '<div class="pagination">';

		// Previous page link
		if (current_page > 1) {
			const prevPage = current_page - 1;
			const prevUrl = prevPage === 1 ? baseUrl : `${baseUrl}${prevPage}/`;
			paginationHTML += `
			<div class="page page--jump">
				<a href="${prevUrl}">← ${previousText}</a>
			</div>`;
		}

		// Calculate the range of page numbers to display
		let startPage = Math.max(1, current_page - 2);
		let endPage = Math.min(total_pages, current_page + 2);

		// Adjust for beginning and end
		if (current_page <= 3) {
			endPage = Math.min(5, total_pages);
		} else if (current_page >= total_pages - 2) {
			startPage = Math.max(1, total_pages - 4);
		}

		// Page number links
		for (let i = startPage; i <= endPage; i++) {
			const isCurrent = i === current_page;
			let pageUrl = '';

			if (i === 1) {
				pageUrl = baseUrl;
			} else {
				pageUrl = `${baseUrl}${i}/`;
			}

			if (isCurrent) {
				paginationHTML += `
				<div class="page page--current"><span>${i}</span></div>`;
			} else {
				paginationHTML += `
				<div class="page">
					<a href="${pageUrl}">${i}</a>
				</div>`;
			}
		}

		// Next page link
		if (current_page < total_pages) {
			const nextPage = current_page + 1;
			const nextUrl = `${baseUrl}${nextPage}/`;
			paginationHTML += `
			<div class="page page--jump">
				<a href="${nextUrl}">${nextText} →</a>
			</div>`;
		}

		paginationHTML += '</div>';

		return paginationHTML;
	}

	injectCta(html, ctaData) {
		let ctaHtml = templates.cta
			.split('{text}')
			.join(ctaData.text)
			.split('{destination_url}')
			.join(ctaData.url);

		let attrs = {
			'[cta]': ctaHtml,
			'{cta}': ctaHtml,
		};

		for (let attr in attrs) {
			html = html.split(attr).join(attrs[attr]);
		}

		return html;
	}
}

export default new Template();
