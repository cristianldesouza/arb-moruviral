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
	const page = request.query.page || 1;
	return Category.handleLang(defaultLang, slug, page, request, env, ctx);
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
	const page = request.query.page || 1;
	return Author.handleLang(defaultLang, slug, page, request, env, ctx);
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
		const page = request.query.page || 1;
		return Category.handleLang(lang, slug, page, request, env, ctx);
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
		const page = request.query.page || 1;
		return Author.handleLang(lang, slug, page, request, env, ctx);
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
		// Processa a requisição com o router
		let response = await router.handle(request, env, ctx);

		// Verifica se o Content-Type da resposta é HTML
		const contentType = response.headers.get('Content-Type') || '';

		if (contentType.includes('text/html')) {
			const url = new URL(request.url);

			// Se a URL não termina com uma barra e não tem extensão
			if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
				// Redireciona para a URL com barra no final (301 Permanent Redirect)
				url.pathname += '/';
				return Response.redirect(url.toString(), 302);
			}
		}

		// Retorna a resposta original, se não for necessário redirecionar
		return response;
	},
};
