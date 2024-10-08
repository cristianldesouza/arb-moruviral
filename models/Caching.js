import constants from '../constants';
const cacheDebug = true;

class Caching {
	async defaultCache(request, env, ctx) {
		if (request.url.includes('cache=delete')) {
			if (cacheDebug) {
				console.log(request.url.split('?')[0] + ' → deletando cache');
			}
			await caches.default.delete(request.url.split('?')[0], {});
		}

		if (constants.CACHING) {
			const start = cacheDebug ? Date.now() : null; // Inicia o contador de tempo se cacheDebug for true

			let response = await caches.default.match(request.url.split('?')[0]);

			if (response) {
				if (cacheDebug) {
					const end = Date.now();
					console.log(request.url.split('?')[0] + '→ Cache hit');
					console.log(`Tempo de execução: ${end - start}ms`);
				}
				return response;
			}

			if (cacheDebug) {
				const end = Date.now();
				console.log(request.url.split('?')[0] + ' → Cache miss');
			}
		}
	}
}

module.exports = new Caching();
