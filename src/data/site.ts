// The site copy lives in content.json — edited from the "Textes du portfolio"
// artifact, or by hand. This file only gives it its types.
import content from './content.json';

export type ExtraField =
	| { label: string; kind: 'date' }
	| { label: string; kind: 'select'; options: string[] }
	| { label: string; kind: 'text'; placeholder: string };

/** Links left on '#' are not displayed; an empty phone is hidden everywhere */
export const SITE = content.site;

export const COPY = {
	...content.copy,
	contact: { ...content.copy.contact, extraField: content.copy.contact.extraField as ExtraField },
};

export const NAV = content.nav;
export const SERVICES = content.services;
export const TOOLS = content.tools;
export const FAQ = content.faq;
export const CV = content.cv;

/** Companies shown in the "Ils m'ont fait confiance" section; logos live in public/media/clients/ */
export const CLIENTS = [
	{ name: 'Bouygues Telecom', href: 'https://www.bouyguestelecom.fr/', logo: '/media/clients/bouygues.svg', role: 'Chargé de communication', contain: true },
	{ name: 'Stuff', href: 'https://www.stuff-reparation.fr/', logo: '/media/clients/stuff.png', role: 'Conseiller de vente' },
	{ name: 'Ville d’Aix-en-Provence', href: 'https://www.aixenprovence.fr/', logo: '/media/clients/aix.svg', role: 'Communication visuelle et digitale', contain: true, onDark: true },
];

/** YouTube channels shown in the same section; logos live in public/media/channels/ */
export const CHANNELS = [
	{ name: 'Cato Minor', href: 'https://www.youtube.com/@Le_CatoMinor', logo: '/media/channels/cato-minor.jpg' },
	{ name: 'Lacrimosophia', href: 'https://www.youtube.com/@lacrimosophia', logo: '/media/channels/lacrimosophia.jpg' },
	{ name: 'Fatche', href: 'https://www.youtube.com/@Fatche_', logo: '/media/channels/fatche.jpg' },
];

/** Replace this file in public/cv/ to update the CV */
export const CV_FILE = '/cv/CV-Marco-Berne.pdf';
