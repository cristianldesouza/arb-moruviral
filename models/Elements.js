import Util from './Util';

class EditorJsToHtmlConverter {
	/**
	 * Converte uma matriz de blocos do EditorJS para HTML.
	 * @param {Array} blocks - Array de blocos do EditorJS.
	 * @returns {string} - HTML gerado a partir dos blocos.
	 */
	convert(blocks, lander = false) {
		let html = '';

		blocks.forEach((block) => {
			switch (block.type) {
				case 'paragraph':
					html += this.convertParagraph(block.data);
					break;
				case 'header':
					html += this.convertHeader(block.data);
					break;
				case 'proConList':
					html += this.convertProConList(block.data);
					break;
				case 'benefitsList':
					if (lander) {
						html += this.convertBenefitsSlider(block.data);
					} else {
						html += this.convertBenefitsList(block.data);
					}
					break;
				case 'proConTable':
					html += this.convertProConTable(block.data);
					break;
				case 'benefitsTable':
					html += this.convertBenefitsTable(block.data);
					break;
				case 'image':
					html += this.convertImage(block.data);
					break;
				case 'list':
					html += this.convertList(block.data);
					break;
				case 'delimiter':
					html += '<hr>';
					break;
				// Adicione mais casos conforme necessário
				default:
					console.warn(`Tipo de bloco desconhecido: ${block.type}`);
			}
		});

		return html;
	}

	/**
	 * Converte um bloco de parágrafo em uma tag <p>.
	 * @param {Object} data - Dados do bloco de parágrafo.
	 * @returns {string} - HTML do parágrafo.
	 */
	convertParagraph(data) {
		// Permite tags HTML dentro do parágrafo
		return `<p>${data.text}</p>\n`;
	}

	/**
	 * Converte um bloco de cabeçalho em tags <h1> a <h6>.
	 * @param {Object} data - Dados do bloco de cabeçalho.
	 * @returns {string} - HTML do cabeçalho.
	 */
	convertHeader(data) {
		const level = data.level >= 1 && data.level <= 6 ? data.level : 2; // Padrão para h2 se nível inválido
		return `<h${level}>${data.text}</h${level}>\n`;
	}

	/**
	 * Converte um bloco de lista de prós e contras em HTML.
	 * @param {Object} data - Dados do bloco de lista de prós e contras.
	 * @returns {string} - HTML da lista de prós e contras.
	 */
	convertProConList(data) {
		const { sectionTitlePros, sectionTitleCons, pros, cons } = data;

		const prosHtml = pros
			.map(
				(pro) => `
            <li class="advantage">
                <div class="item-container">
                    <span class="title">${this.sanitizeHtml(pro.title)}</span>
                    <p class="adv-text">${pro.description}</p>
                </div>
            </li>
        `
			)
			.join('');

		const consHtml = cons
			.map(
				(con) => `
            <li class="disadvantage">
                <div class="item-container">
                    <span class="title">${this.sanitizeHtml(con.title)}</span>
                    <p class="adv-text">${con.description}</p>
                </div>
            </li>
        `
			)
			.join('');

		return `
<hr>
<div class="pros-cons-wrapper">
    <!-- Lista de Puntos Positivos -->
    <section class="white pros-section" data-block-type="prosSection">
        <div class="adv-container">
            <div class="pros-cons advantages">
                <div class="advantages">
                    <h2 class="adv-heading">${this.sanitizeHtml(sectionTitlePros)}</h2>
                    <ul class="pros-cons-list">
                        ${prosHtml}
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <hr>
    <!-- Lista de Puntos Negativos -->
    <section class="white cons-section" data-block-type="consSection">
        <div class="adv-container">
            <div class="pros-cons disadvantages">
                <div class="disadvantages">
                    <h2 class="adv-heading">${this.sanitizeHtml(sectionTitleCons)}</h2>
                    <ul class="pros-cons-list">
                        ${consHtml}
                    </ul>
                </div>
            </div>
        </div>
    </section>
</div>
<hr>
`;
	}

	/**
	 * Converte um bloco de lista de benefícios em HTML.
	 * Utiliza classes do FontAwesome para ícones.
	 * @param {Object} data - Dados do bloco de lista de benefícios.
	 * @returns {string} - HTML da lista de benefícios.
	 */
	convertBenefitsList(data) {
		const { sectionTitle, items } = data;

		const itemsHtml = items
			.map(
				(item) => `
            <li>
                <div>
                    <i class="${this.sanitizeHtml(item.icon)} item-icon"></i>
                </div>
                <div class="vertical-content">
                    <span>${this.sanitizeHtml(item.name)}</span>
                    <span class="v-value">
                        <b>${this.sanitizeHtml(item.description)}</b>
                    </span>
                </div>
            </li>
        `
			)
			.join('');

		return `
<div class="vertical-details">
    <ul>
        ${itemsHtml}
    </ul>
</div>
`;
	}

	convertBenefitsSlider(data) {
		const { items } = data;

		const itemsHtml = items
			.map(
				(item) => `<div class="benefit-card">
    <div class="icon">
        <i class="${this.sanitizeHtml(item.icon)}"></i>
    </div>
    <h2 class="benefit-title">${this.sanitizeHtml(item.name)}</h2>
    <p class="benefit-description">${this.sanitizeHtml(item.description)}</p>
</div>`
			)
			.join('');

		return `<div class="credit-card-benefits">
    <div class="arrow left" onclick="slideLeft()" aria-label="Slide para a esquerda">
        <i class="fas fa-chevron-left"></i>
    </div>    
    <div class="benefits-container" id="benefits-container">
        ${itemsHtml}
       </div>
<div class="arrow right" onclick="slideRight()" aria-label="Slide para a direita">
    <i class="fas fa-chevron-right"></i>
</div>
</div>
`;
	}

	/**
	 * Converte um bloco de tabela de prós e contras em HTML.
	 * @param {Object} data - Dados do bloco de tabela de prós e contras.
	 * @returns {string} - HTML da tabela de prós e contras.
	 */
	convertProConTable(data) {
		const { sectionTitlePros, sectionTitleCons, items } = data;

		const rowsHtml = items
			.map(
				(item) => `
            <tr>
                <td>${this.sanitizeHtml(item.pro)}</td>
                <td>${this.sanitizeHtml(item.con)}</td>
            </tr>
        `
			)
			.join('');

		return `
<div class="table-responsive">
    <table>
        <thead>
            <tr>
                <th class="pros">{{pro_points_language}}</th>
                <th class="cons">{{cons_points_language}}</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>
</div>
`;
	}

	/**
	 * Converte um bloco de tabela de benefícios em HTML.
	 * @param {Object} data - Dados do bloco de tabela de benefícios.
	 * @returns {string} - HTML da tabela de benefícios.
	 */
	convertBenefitsTable(data) {
		const { title, items } = data;

		const rowsHtml = items
			.map(
				(item) => `
            <tr>
                <td class="text-center">
                    <strong>${this.sanitizeHtml(item.name)}</strong>
                    <br>
                </td>
                <td class="text-center">${this.sanitizeHtml(item.description)}</td>
            </tr>
        `
			)
			.join('');

		return `
<div class="table-responsive">
    <table>
        <thead>
            <tr>
                <th colspan="2" class="benefits-th">${this.sanitizeHtml(title)}</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>
</div>
`;
	}

	/**
	 * Converte um bloco de imagem em HTML.
	 * Utiliza classes do FontAwesome diretamente para ícones.
	 * @param {Object} data - Dados do bloco de imagem.
	 * @returns {string} - HTML da imagem.
	 */
	convertImage(data) {
		const { file, caption, withBorder, withBackground, stretched, icon } = data;
		const classes = [
			withBorder ? 'with-border' : '',
			withBackground ? 'with-background' : '',
			stretched ? 'stretched' : '',
		]
			.filter(Boolean)
			.join(' ');

		// Se um ícone for fornecido, utiliza-o
		const iconHtml = icon ? `<i class="${this.sanitizeHtml(icon)} image-icon"></i>` : '';

		return `
<div class="image-block ${classes}">
    ${iconHtml}
    <img loading="lazy" src="${this.sanitizeHtml(
		Util.generateCdnUrl(file.url, 750, 420, 70)
	)}" alt="${this.sanitizeHtml(caption || '')}">
    ${caption ? `<p class="caption">${this.sanitizeHtml(caption)}</p>` : ''}
</div>
`;
	}

	/**
	 * Converte um bloco de lista em HTML.
	 * Suporta listas ordenadas e desordenadas.
	 * @param {Object} data - Dados do bloco de lista.
	 * @returns {string} - HTML da lista.
	 */
	convertList(data) {
		const { style, items } = data;
		const listTag = style === 'ordered' ? 'ol' : 'ul';
		const itemsHtml = items.map((item) => `<li>${item}</li>`).join('');

		return `
<${listTag}>
    ${itemsHtml}
</${listTag}>
`;
	}

	/**
	 * Sanitiza o conteúdo HTML para prevenir injeções maliciosas.
	 * Permite apenas certas tags de formatação.
	 * @param {string} html - Conteúdo HTML a ser sanitizado.
	 * @returns {string} - HTML sanitizado.
	 */
	sanitizeHtml(html) {
		if (!html) return '';
		// Lista de tags permitidas
		const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'br', 'ul', 'ol', 'li', 'p', 'span'];
		return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
			return allowedTags.includes(tag.toLowerCase()) ? match : '';
		});
	}
}

module.exports = new EditorJsToHtmlConverter();
