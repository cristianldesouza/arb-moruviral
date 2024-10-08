class Requests {
	async list() {
		console.log('Iniciando requisição...');

		const apiUrl =
			'https://arb-cms.sitecdn.me/api/posts/list/?access_token=8b728313e20494c2021594afa82bc5f3';
		const startTime = Date.now(); // Marca o tempo de início

		try {
			// Faz o fetch da URL
			const response = await fetch(apiUrl, {
				method: 'GET',
			});

			// Verifica se a resposta foi bem-sucedida
			if (!response.ok) {
				console.log('xabu');
				throw new Error(`Erro na requisição: ${response.status}`);
			}

			// Verifica o tipo de conteúdo da resposta
			const contentType = response.headers.get('content-type');

			let data;
			if (contentType && contentType.includes('application/json')) {
				// Se for JSON, converte para JSON
				data = await response.json();
				console.log('JSON recebido:', data);
			} else {
				// Para outros tipos de resposta, retorna como texto
				data = await response.text();
				console.log('Resposta não-JSON recebida:', data);
			}

			// Se for JSON, retorna a chave 'results' se existir
			if (data && typeof data === 'object' && 'results' in data) {
				return data.results;
			}

			// Caso contrário, retorna a resposta completa
			return data;
		} catch (error) {
			console.error('Erro na requisição:', error.message);
			throw error;
		} finally {
			const endTime = Date.now(); // Marca o tempo de término
			const duration = endTime - startTime; // Calcula a duração
			console.log(`Tempo de execução: ${duration} ms`);
		}
	}

	// New method to get a post by its slug and language
	getPostData(slug, language, domain) {
		return new Promise(async (resolve) => {
			const apiUrl = `https://arb-cms.sitecdn.me/api/posts/get/${language}/${slug}/`;

			try {
				// Make the fetch request to get the post, now with method POST to send domain in the body
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
					}),
				});

				// Check if the response was successful
				if (!response.ok) {
					throw new Error(`Erro na requisição: ${response.status}`);
				}

				// Parse the response content
				const contentType = response.headers.get('content-type');
				let data;
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Return the post data if it's JSON and contains the 'post' key
				if (data && typeof data === 'object' && 'post' in data) {
					return resolve(data.post);
				}

				// Otherwise, return the whole response
				return resolve(data);
			} catch (error) {
				console.error('Erro ao buscar post:', error.message);
				return resolve(false);
			}
		});
	}

	getCategoryData(slug, language, domain, page) {
		return new Promise(async (resolve) => {
			const apiUrl = `https://arb-cms.sitecdn.me/api/categories/get/${language}/${slug}/`;

			try {
				// Make the fetch request to get the post, now with method POST to send domain in the body
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
						page,
					}),
				});

				// Check if the response was successful
				if (!response.ok) {
					throw new Error(`Erro na requisição: ${response.status}`);
				}

				// Parse the response content
				const contentType = response.headers.get('content-type');
				let data;
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Return the post data if it's JSON and contains the 'post' key
				if (data && typeof data === 'object' && 'post' in data) {
					return resolve(data.post);
				}

				// Otherwise, return the whole response
				return resolve(data);
			} catch (error) {
				console.error('Erro ao buscar post:', error.message);
				return resolve(false);
			}
		});
	}

	getAuthorData(slug, language, domain, page) {
		return new Promise(async (resolve) => {
			const apiUrl = `https://arb-cms.sitecdn.me/api/authors/get/${language}/${slug}/`;

			try {
				// Make the fetch request to get the post, now with method POST to send domain in the body
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
						page,
					}),
				});

				// Check if the response was successful
				if (!response.ok) {
					throw new Error(`Erro na requisição: ${response.status}`);
				}

				// Parse the response content
				const contentType = response.headers.get('content-type');
				let data;
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Return the post data if it's JSON and contains the 'post' key
				if (data && typeof data === 'object' && 'post' in data) {
					return resolve(data.post);
				}

				// Otherwise, return the whole response
				return resolve(data);
			} catch (error) {
				console.error('Erro ao buscar post:', error.message);
				return resolve(false);
			}
		});
	}

	getPageData(slug, language, domain) {
		return new Promise(async (resolve) => {
			const apiUrl = `https://arb-cms.sitecdn.me/api/pages/get/${language}/${slug}/`;

			try {
				// Make the fetch request to get the post, now with method POST to send domain in the body
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
					}),
				});

				// Check if the response was successful
				if (!response.ok) {
					throw new Error(`Erro na requisição: ${response.status}`);
				}

				// Parse the response content
				const contentType = response.headers.get('content-type');
				let data;
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Return the post data if it's JSON and contains the 'post' key
				if (data && typeof data === 'object' && 'post' in data) {
					return resolve(data.post);
				}

				// Otherwise, return the whole response
				return resolve(data);
			} catch (error) {
				console.error('Erro ao buscar post:', error.message);
				return resolve(false);
			}
		});
	}

	getLastPosts(language, domain) {
		return new Promise(async (resolve) => {
			// Construct the API URL by injecting the language parameter
			const apiUrl = `https://arb-cms.sitecdn.me/api/posts/get/last-posts/${language}/`;

			try {
				// Make the fetch request to the API endpoint with method POST
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
					}),
				});

				// Check if the response was successful (status code 200-299)
				if (!response.ok) {
					throw new Error(`Request failed with status: ${response.status}`);
				}

				// Determine the response content type
				const contentType = response.headers.get('content-type');
				let data;

				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Check if the response contains the 'last_posts' key
				if (data && typeof data === 'object' && 'last_posts' in data) {
					return resolve(data.last_posts);
				}

				// If 'last_posts' is not present, resolve with the entire data
				return resolve(data);
			} catch (error) {
				console.error('Error fetching last posts:', error.message);
				return resolve(false);
			}
		});
	}

	getLandingData(slug, language, domain) {
		return new Promise(async (resolve) => {
			const apiUrl = `https://arb-cms.sitecdn.me/api/landing/get/${language}/${slug}/`;

			try {
				// Make the fetch request to get the post, now with method POST to send domain in the body
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						domain, // Send the domain in the request body
					}),
				});

				// Check if the response was successful
				if (!response.ok) {
					throw new Error(`Erro na requisição: ${response.status}`);
				}

				// Parse the response content
				const contentType = response.headers.get('content-type');
				let data;
				if (contentType && contentType.includes('application/json')) {
					// If the response is JSON, parse it
					data = await response.json();
				} else {
					// Otherwise, treat it as text
					data = await response.text();
				}

				// Return the post data if it's JSON and contains the 'post' key
				if (data && typeof data === 'object' && 'post' in data) {
					return resolve(data.post);
				}

				// Otherwise, return the whole response
				return resolve(data);
			} catch (error) {
				console.error('Erro ao buscar post:', error.message);
				return resolve(false);
			}
		});
	}
}

module.exports = new Requests();
