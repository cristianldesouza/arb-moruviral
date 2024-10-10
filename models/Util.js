class Util {
	getReadTime(content) {
		const allText = extractText(content);

		let readTimeInMinutes = parseInt(allText.length / 4.53 / 200).toString();

		if (isNaN(readTimeInMinutes) || readTimeInMinutes < 1) {
			readTimeInMinutes = 1;
		}

		return readTimeInMinutes;
	}

	generateCdnUrl(url, width, height, quality) {
		// Parse the original URL to get the domain and file path
		const urlParts = url.split('/');
		const domain = urlParts[3]; // Get the domain part (e.g., moruviral.com)
		const imagePath = urlParts.slice(4).join('/'); // Get the remaining part of the URL

		// Construct the new CDN URL
		const cdnUrl = `https://cdn.${domain}/${width}/${height}/${quality}/${domain}/${imagePath}`;

		return cdnUrl;
	}
}

// Função recursiva para extrair textos das chaves especificadas
function extractText(item) {
	// Lista de chaves que contêm textos relevantes
	const keysToInclude = [
		'name',
		'description',
		'text',
		'title',
		'caption',
		'sectionTitlePros',
		'sectionTitleCons',
		'sectionTitle',
	];

	let text = '';

	if (typeof item === 'object' && item !== null) {
		if (Array.isArray(item)) {
			item.forEach((subItem) => {
				text += extractText(subItem) + ' ';
			});
		} else {
			Object.entries(item).forEach(([key, value]) => {
				if (keysToInclude.includes(key)) {
					if (typeof value === 'string') {
						// Remove tags HTML
						const cleanText = value.replace(/<[^>]*>/g, ' ');
						text += cleanText + ' ';
					}
				} else {
					// Continua a busca em objetos ou arrays aninhados
					text += extractText(value) + ' ';
				}
			});
		}
	}

	return text;
}

export default new Util();
