import { Router } from 'itty-router';
import {
	getAssetFromKV,
	mapRequestToAsset,
	NotFoundError,
	MethodNotAllowedError,
} from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import Category from './controllers/Category';
import Contact from './controllers/Contact';
import Author from './controllers/Author';
import Page from './controllers/Page';
import constants from './constants';
import Home from './controllers/Home';
import Post from './controllers/Post';
import Landing from './controllers/Landing';
import Caching from './models/Caching';

const assetManifest = JSON.parse(manifestJSON);

const languages = constants.LANGUAGES;

const router = Router();

const defaultLang = languages[0];
const supportedLangs = languages.slice(1); // ['en', 'es']

// Home Page
router.get('/', Caching.defaultCache, (request, env, ctx) => {
	return Home.handleHomeLang(defaultLang, request, env, ctx);
});

router.post('/api/contact/message/', Contact.receiveMessage);

// Categorias - /c/:slug/*
router.get('/c/:slug/*', (request, env, ctx) => {
	const { slug } = request.params;

	const url = new URL(request.url);
	const pathname = url.pathname;
	const segments = pathname.split('/').filter((segment) => segment.length > 0);
	const lastSegment = segments[segments.length - 1];
	const pageNum = parseInt(lastSegment, 10);
	const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

	return Category.handleLang(defaultLang, slug, validPage, request, env, ctx);
});

// Posts - /p/:slug/*
router.get('/p/:slug/*', Caching.defaultCache, (request, env, ctx) => {
	const { slug } = request.params;
	return Post.handleLang(defaultLang, slug, request, env, ctx);
});

// Landings - /l/:slug/*
router.get('/l/:slug/*', (request, env, ctx) => {
	const { slug } = request.params;
	return Landing.handleLang(defaultLang, slug, request, env, ctx);
});

// Autores - /a/:slug/*
router.get('/a/:slug/*', (request, env, ctx) => {
	const { slug } = request.params;

	const url = new URL(request.url);
	const pathname = url.pathname;
	const segments = pathname.split('/').filter((segment) => segment.length > 0);
	const lastSegment = segments[segments.length - 1];
	const pageNum = parseInt(lastSegment, 10);
	const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

	return Author.handleLang(defaultLang, slug, validPage, request, env, ctx);
});

// Páginas Estáticas - /s/:slug/*
router.get('/s/:slug/*', (request, env, ctx) => {
	const { slug } = request.params;
	return Page.handleLang(defaultLang, slug, request, env, ctx);
});

// Routes for other languages
supportedLangs.forEach((lang) => {
	// Home Page - /:lang/
	router.get(`/${lang}/`, Caching.defaultCache, (request, env, ctx) => {
		return Home.handleHomeLang(lang, request, env, ctx);
	});

	// Categorias - /:lang/c/:slug/*
	router.get(`/${lang}/c/:slug/*`, (request, env, ctx) => {
		const { slug } = request.params;

		const url = new URL(request.url);
		const pathname = url.pathname;
		const segments = pathname.split('/').filter((segment) => segment.length > 0);
		const lastSegment = segments[segments.length - 1];
		const pageNum = parseInt(lastSegment, 10);
		const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

		return Category.handleLang(lang, slug, validPage, request, env, ctx);
	});

	// Posts - /:lang/p/:slug/*
	router.get(`/${lang}/p/:slug/*`, Caching.defaultCache, (request, env, ctx) => {
		const { slug } = request.params;
		return Post.handleLang(lang, slug, request, env, ctx);
	});

	// Landings - /:lang/l/:slug/*
	router.get(`/${lang}/l/:slug/*`, (request, env, ctx) => {
		const { slug } = request.params;
		return Landing.handleLang(lang, slug, request, env, ctx);
	});

	// Autores - /:lang/a/:slug/*
	router.get(`/${lang}/a/:slug/*`, (request, env, ctx) => {
		const { slug } = request.params;

		const url = new URL(request.url);
		const pathname = url.pathname;
		const segments = pathname.split('/').filter((segment) => segment.length > 0);
		const lastSegment = segments[segments.length - 1];
		const pageNum = parseInt(lastSegment, 10);
		const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

		return Author.handleLang(lang, slug, validPage, request, env, ctx);
	});

	// Páginas Estáticas - /:lang/s/:slug/*
	router.get(`/${lang}/s/:slug/*`, (request, env, ctx) => {
		const { slug } = request.params;
		return Page.handleLang(lang, slug, request, env, ctx);
	});
});

// Handle favicon + public assets
router.get('/favicon.ico', Caching.defaultCache, async (request, env, ctx) => {
	//const startTime = Date.now(); // Captura o tempo de início

	try {
		const response = await getAssetFromKV(
			{
				request,
				waitUntil(promise) {
					return ctx.waitUntil(promise);
				},
			},
			{
				ASSET_NAMESPACE: env.__STATIC_CONTENT,
				ASSET_MANIFEST: assetManifest,
				mapRequestToAsset: (req) => {
					const url = new URL(req.url);
					url.pathname = '/favicon.ico';
					return new Request(url.toString(), req);
				},
			}
		);

		// Armazena a resposta no cache depois de recebê-la
		ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

		//const endTime = Date.now(); // Captura o tempo de fim
		//const duration = endTime - startTime; // Calcula a duração

		//console.log(`Tempo de execução: ${duration}ms`); // Loga a velocidade da ação

		return response;
	} catch (e) {
		console.log('erro ao buscar asset', e);
	}
});

router.get('/public/*', Caching.defaultCache, async (request, env, ctx) => {
	const startTime = Date.now(); // Captura o tempo de início

	try {
		const response = await getAssetFromKV(
			{
				request,
				waitUntil(promise) {
					return ctx.waitUntil(promise);
				},
			},
			{
				ASSET_NAMESPACE: env.__STATIC_CONTENT,
				ASSET_MANIFEST: assetManifest,
				mapRequestToAsset: (req) => {
					const url = new URL(req.url);
					// Remove o prefixo '/public' do pathname da URL
					url.pathname = url.pathname.replace(/^\/public/, '');
					return new Request(url.toString(), req);
				},
			}
		);

		// Armazena a resposta no cache depois de recebê-la
		ctx.waitUntil(caches.default.put(request.url.split('?')[0], response.clone()));

		const endTime = Date.now(); // Captura o tempo de fim
		const duration = endTime - startTime; // Calcula a duração

		console.log(`Tempo de execução: ${duration}ms`); // Loga o tempo de execução

		return response;
	} catch (e) {
		console.log(e);
	}
});

// Handle CORS preflight
/*function handleOptions(request) {
	let headers = new Headers();
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	return new Response(null, {
		status: 204,
		headers: headers,
	});
}*/

// 404 handler
import NotFound from './controllers/NotFound';
router.all('*', NotFound.index);

// Export the worker
/*
export default {
	fetch: (request, env, ctx) => {
		//if (request.method === 'OPTIONS') {
		//	return handleOptions(request);
		//} else {
			return router.handle(request, env, ctx);
		//}
	},
};*/

export default {
	fetch: async (request, env, ctx) => {
		let url = new URL(request.url);
		let needRedirect = false;

		// Ensure the protocol is HTTPS and host is 'moruviral.com' (without 'www.')
		if (url.protocol !== 'https:' || url.hostname !== constants.DOMAIN) {
			url.protocol = 'https:';

			// Remove 'www.' from the hostname if present
			if (url.hostname.startsWith('www.')) {
				url.hostname = url.hostname.slice(4);
			}

			// Ensure the hostname is 'moruviral.com'
			if (url.hostname !== constants.DOMAIN) {
				url.hostname = constants.DOMAIN;
			}

			needRedirect = true;
		}

		// If the URL doesn't end with a slash and doesn't have an extension
		if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
			url.pathname += '/';
			needRedirect = true;
		}

		// If a redirect is needed, perform it
		if (needRedirect) {
			return Response.redirect(url.toString(), 302);
		}

		// Process the request with the router
		let response = await router.handle(request, env, ctx);

		return response;
	},
};
