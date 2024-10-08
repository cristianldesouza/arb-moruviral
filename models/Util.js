class Util {
	getReadTime(content) {
		const allText = extractText(content);

		let readTimeInMinutes = parseInt(allText.length / 4.53 / 200).toString();

		if (isNaN(readTimeInMinutes) || readTimeInMinutes < 1) {
			readTimeInMinutes = 1;
		}

		return readTimeInMinutes;
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
