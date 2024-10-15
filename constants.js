module.exports = Object.freeze({
	CACHING: true,
	CACHE_CONTROL_TIME: 86400,
	CMS_ENDPOINT: 'https://metacms.highstakes.tech',
	PUBLIC_KEY:
		'BBSIN_16XjPEEKOkcGwLHgnBFPjZgxBjFQHZ_BXn206dP3nzLpU7WryrIgmQ629AIg0rQo9I8Cl51QijEoOnsYk',
	LANGUAGES: ['pt', 'es', 'en', 'de', 'fr'],
	DOMAIN: 'moruviral.com',
	SITE_NAME: 'Moruviral',
	SITE_SLOGAN: {
		en: 'Smart Financial Choices',
		pt: 'Escolhas Financeiras Inteligentes',
		es: 'Elecciones Financieras Inteligentes',
		de: 'Intelligente Finanzentscheidungen',
		fr: 'Choix Financiers Intelligents',
	},
	SITE_DESCRIPTION: {
		en: 'Moruviral is a financial comparison website that helps you make smart financial choices.',
		pt: 'Moruviral é um site de comparação financeira que ajuda você a fazer escolhas financeiras inteligentes.',
		es: 'Moruviral es un sitio web de comparación financiera que te ayuda a tomar decisiones financieras inteligentes.',
		fr: 'Moruviral est un site de comparaison financière qui vous aide à faire des choix financiers intelligents.',
		de: 'Moruviral ist eine Finanzvergleichs-Website, die Ihnen hilft, kluge finanzielle Entscheidungen zu treffen.',
	},
	MENU: {
		pt: `<li><a href="/">Início</a></li>
<li><a href="/c/emprestimos-pessoais/">Empréstimos Pessoais</a></li>
<li><a href="/c/cartoes-de-credito/">Cartões de Crédito</a></li>
<li><a href="/c/mercado-financeiro/">Mercado Financeiro</a></li>
<li><a href="/c/educacao-financeira/">Educação Financeira</a></li>
<li><a href="/c/investimentos/">Investimentos</a></li>
<li><a href="/c/empreendedorismo/">Empreendedorismo</a></li>`,
		en: `<li><a href="/en/">Home</a></li>
<li><a href="/en/c/personal-loans/">Personal Loans</a></li>
<li><a href="/en/c/credit-cards/">Credit Cards</a></li>
<li><a href="/en/c/financial-education/">Financial Education</a></li>
<li><a href="/en/c/entrepreneurship/">Entrepreneurship</a></li>
<li><a href="/en/c/investments/">Investments</a></li>
<li><a href="/en/c/financial-market/">Financial Market</a></li>`,

		es: `<li><a href="/es/">Inicio</a></li>
<li><a href="/es/c/prestamos-personales/">Préstamos Personales</a></li>
<li><a href="/es/c/tarjetas-de-credito/">Tarjetas de Crédito</a></li>
<li><a href="/es/c/educacion-financiera/">Educación Financiera</a></li>
<li><a href="/es/c/emprendimiento/">Emprendimiento</a></li>
<li><a href="/es/c/inversiones/">Inversiones</a></li>
<li><a href="/es/c/mercado-financiero/">Mercado Financiero</a></li>`,

		de: `<li><a href="/de/">Startseite</a></li>
<li><a href="/de/c/personliche-kredite/">Persönliche Kredite</a></li>
<li><a href="/de/c/kreditkarten/">Kreditkarten</a></li>
<li><a href="/de/c/finanzbildung/">Finanzbildung</a></li>
<li><a href="/de/c/unternehmertum/">Unternehmertum</a></li>
<li><a href="/de/c/investitionen/">Investitionen</a></li>
<li><a href="/de/c/finanzmarkt/">Finanzmarkt</a></li>`,

		fr: `<li><a href="/fr/">Accueil</a></li>
<li><a href="/fr/c/prets-personnels/">Prêts Personnels</a></li>
<li><a href="/fr/c/cartes-de-credit/">Cartes de Crédit</a></li>
<li><a href="/fr/c/education-financiere/">Éducation Financière</a></li>
<li><a href="/fr/c/entrepreneuriat/">Entrepreneuriat</a></li>
<li><a href="/fr/c/investissements/">Investissements</a></li>
<li><a href="/fr/c/marche-financier/">Marché Financier</a></li>`,
	},
	READ_TIME: {
		en: 'minutes to read',
		es: 'min de lectura',
		pt: 'min de leitura',
		fr: 'minutes de lecture',
		de: 'Minuten zu lesen',
	},
	WRITTEN_BY: {
		en: 'By',
		es: 'Por',
		pt: 'Por',
		fr: 'Par',
		de: 'Von',
	},
	POPULAR_CATEGORIES_TITLE: {
		en: 'Popular Categories',
		es: 'Categorías Populares',
		pt: 'Categorias Populares',
		fr: 'Catégories Populaires',
		de: 'Beliebte Kategorien',
	},
	LOGO_URL: 'https://via.placeholder.com/150',
	FOOTER_LEFT_MENU: {
		en: `<li><a href="/en/s/about-the-mejorescreditos/">About</a></li>
			 <li><a href="/en/s/contact/">Contact</a></li>
			 <li><a href="/en/s/terms-of-use/">Terms of Use</a></li>`,

		es: `<li><a href="/es/s/acerca-de-mejorescreditos/">Acerca de</a></li>
			 <li><a href="/es/s/contact/">Contacto</a></li>
			 <li><a href="/es/s/terminos-de-uso/">Términos de Uso</a></li>`,

		pt: `<li><a href="/s/sobre-o-mejorescreditos/">Sobre</a></li>
			 <li><a href="/s/contact/">Contato</a></li>
			 <li><a href="/s/termos-de-uso/">Termos de Uso</a></li>`,

		fr: `<li><a href="/fr/s/a-propos-de-mejorescreditos/">À propos</a></li>
			 <li><a href="/fr/s/contact/">Contact</a></li>
			 <li><a href="/fr/s/conditions-dutilisation/">Conditions d'utilisation</a></li>`,

		de: `<li><a href="/de/s/uber-mejorescreditos/">Über</a></li>
			 <li><a href="/de/s/contact/">Kontakt</a></li>
			 <li><a href="/de/s/nutzungsbedingungen/">Nutzungsbedingungen</a></li>`,
	},
	FOOTER_RIGHT_MENU: {
		en: `<li><a href="/s/privacy-policy/">Privacy Policy</a></li>
			 <li><a href="/a/">Editors</a></li>`,

		es: `<li><a href="/es/s/politica-de-privacidad/">Política de Privacidad</a></li>
			 <li><a href="/es/a/">Editores</a></li>`,

		pt: `<li><a href="/s/politica-de-privacidade/">Política de Privacidade</a></li>
			 <li><a href="/a/">Editores</a></li>`,

		fr: `<li><a href="/fr/s/politique-de-confidentialite/">Politique de Confidentialité</a></li>
			 <li><a href="/fr/a/">Éditeurs</a></li>`,

		de: `<li><a href="/de/s/datenschutzrichtlinie/">Datenschutzrichtlinie</a></li>
			 <li><a href="/de/a/">Redakteure</a></li>`,
	},
	ALL_RIGHTS: {
		en: `All rights reserved.`,
		pt: `Todos os direitos reservados.`,
		es: `Todos los derechos reservados.`,
		fr: `Tous droits réservés.`,
		de: `Alle Rechte vorbehalten.`,
	},
	SOCIAL_MEDIA: {
		instagram: 'https://www.instagram.com/mejorescreditos/',
		facebook: 'https://www.facebook.com/mejorescreditos/',
	},
	PRO_POINTS_LANGUAGE: {
		pt: 'Pontos Positivos',
		es: 'Puntos Positivos',
		en: 'Pros',
		fr: 'Points Positifs',
		de: 'Vorteile',
	},
	CONS_POINTS_LANGUAGE: {
		pt: 'Pontos Negativos',
		es: 'Puntos Negativos',
		en: 'Cons',
		fr: 'Points Négatifs',
		de: 'Nachteile',
	},
	SIDEBAR_TITLE: {
		pt: 'Últimos Artigos',
		en: 'Latest Articles',
		es: 'Últimos Artículos',
		fr: 'Derniers Articles',
		de: 'Neueste Artikel',
	},
	RELATED_TITLE: {
		pt: 'Artigos Relacionados',
		en: 'Related Articles',
		es: 'Artículos Relacionados',
		fr: 'Articles Connexes',
		de: 'Verwandte Artikel',
	},
	CONTACT_DATA: {
		TITLE: {
			pt: 'Contato',
			en: 'Contact',
			es: 'Contacto',
			fr: 'Contact',
			de: 'Kontakt',
		},
		SUBTITLE: {
			pt: 'Entre em Contato com Nossa Equipe',
			en: 'Get in Contact with Our Team',
			es: 'Póngase en Contacto con Nuestro Equipo',
			fr: 'Contactez Notre Équipe',
			de: 'Nehmen Sie Kontakt mit Unserem Team auf',
		},
		TEXT: {
			pt: 'Nos envie uma mensagem usando o formulário abaixo e nós entraremos em contato o mais rápido possível.',
			en: 'Send us a message using the form below and we will contact you as soon as possible.',
			es: 'Envíenos un mensaje mediante el siguiente formulario y nos pondremos en contacto con usted lo antes posible.',
			fr: 'Envoyez-nous un message via le formulaire ci-dessous et nous vous contacterons dès que possible.',
			de: 'Senden Sie uns eine Nachricht über das untenstehende Formular und wir werden Sie so schnell wie möglich kontaktieren.',
		},
		PLACEHOLDER_NAME: {
			pt: 'Nome',
			en: 'Name',
			es: 'Nombre',
			fr: 'Nom',
			de: 'Name',
		},
		PLACEHOLDER_SUBJECT: {
			pt: 'Assunto',
			en: 'Subject',
			es: 'Asunto',
			fr: 'Sujet',
			de: 'Betreff',
		},
		PLACEHOLDER_MESSAGE: {
			pt: 'Mensagem',
			en: 'Message',
			es: 'Mensaje',
			fr: 'Message',
			de: 'Nachricht',
		},
		BUTTON_TEXT: {
			pt: 'Enviar Mensagem',
			en: 'Send Message',
			es: 'Enviar Mensaje',
			fr: 'Envoyer le Message',
			de: 'Nachricht Senden',
		},
		SENDING_MESSAGE: {
			pt: 'Enviando...',
			en: 'Sending...',
			es: 'Envío...',
			fr: 'Envoi...',
			de: 'Senden...',
		},
		SUCCESS_MESSAGE: {
			pt: 'Sua mensagem foi enviada com sucesso!',
			en: 'Your message has been sent successfully!',
			es: '¡Tu mensaje ha sido enviado exitosamente!',
			fr: 'Votre message a été envoyé avec succès !',
			de: 'Ihre Nachricht wurde erfolgreich gesendet!',
		},
		SERVER_ERROR_MESSAGE: {
			pt: 'Ocorreu um erro ao mandar sua mensagem.',
			en: 'An error occurred while sending your message.',
			es: 'Se produjo un error al enviar su mensaje.',
			fr: 'Une erreur s’est produite lors de l’envoi de votre message.',
			de: 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten.',
		},
		FORM_ERROR_MESSAGE: {
			pt: 'Houve um problema ao mandar sua mensagem. Por favor tente novamente mais tarde.',
			en: 'There was a problem submitting your message. Please try again later.',
			es: 'Hubo un problema al enviar su mensaje. Inténtelo de nuevo más tarde.',
			fr: 'Un problème est survenu lors de l’envoi de votre message. Veuillez réessayer plus tard.',
			de: 'Beim Senden Ihrer Nachricht ist ein Problem aufgetreten. Bitte versuchen Sie es später erneut.',
		},
	},
	PAGINATION: {
		NEXT: {
			pt: 'Próxima',
			en: 'Next',
			es: 'Seguinte',
			fr: 'Suivant',
			de: 'Nächste',
		},
		PREVIOUS: {
			pt: 'Anterior',
			en: 'Previous',
			es: 'Anterior',
			fr: 'Précédent',
			de: 'Vorherige',
		},
	},
	DATE_FORMATS: {
		en: 'MM/DD/YYYY',
		es: 'DD/MM/YYYY',
		pt: 'DD/MM/YYYY',
		de: 'DD.MM.YYYY',
		fr: 'DD/MM/YYYY',
	},
	AUTHORS_LIST_TITLE: {
		en: 'Authors',
		es: 'Autores',
		pt: 'Autores',
		de: 'Autoren',
		fr: 'Auteurs',
	},
	NOT_FOUND: {
		pt: {
			TITLE: 'Página não encontrada',
			TEXT: 'A URL pode estar incorreta ou a página pode não existir mais.',
		},
		en: {
			TITLE: 'Page Not Found',
			TEXT: 'The URL might be incorrect or the page may no longer exist.',
		},
		es: {
			TITLE: 'Página no encontrada',
			TEXT: 'Puede que la URL sea incorrecta o que la página ya no exista.',
		},
		de: {
			TITLE: 'Seite nicht gefunden',
			TEXT: 'Die URL könnte falsch sein oder die Seite existiert nicht mehr.',
		},
		fr: {
			TITLE: 'Page non trouvée',
			TEXT: "L'URL est peut-être incorrecte ou la page n'existe plus.",
		},
	},
});
