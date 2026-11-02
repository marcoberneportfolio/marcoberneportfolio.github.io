import type { CSSProperties, ReactNode } from 'react';

/** Hand lettering for the notes scribbled next to the drawings. */
const NOTE = { fontFamily: "'Caveat', cursive" } as const;

// The drawings of the artist's desk, in the gaps between the projects: x, y and width in %
// of the screen like the projects, a tilt, and a delay so that they appear one after another
const SKETCHES: { x: number; y: number; w: number; r: number; view: string; art: ReactNode }[] = [
	{
		// A camera, with the settings of the shot noted below
		x: 36,
		y: 6,
		w: 9,
		r: -6,
		view: '0 0 120 112',
		art: (
			<>
				<path d="M12 30C30 27 88 26 108 29C110 47 109 66 107 80C80 82 36 82 13 81C11 62 11 45 12 30Z" />
				<path d="M40 29L46 18C55 16 66 16 73 19L79 29" />
				<circle cx="60" cy="54" r="19" />
				<circle cx="60" cy="54" r="10.5" />
				<path d="M53 48Q56 44.5 61 44.5" />
				<path d="M20 36H33V43H20Z" />
				<path d="M88 22H99" />
				<text x="12" y="106" fontSize="20" style={NOTE} fill="currentColor" stroke="none">
					f/2.8 · 1/250
				</text>
			</>
		),
	},
	{
		// A layout being worked out: picture, lines of text, and the note of the version
		x: 15.5,
		y: 30.5,
		w: 9.5,
		r: 4,
		view: '0 0 130 120',
		art: (
			<>
				<path d="M10 8C40 6 80 7 96 8C98 40 97 80 96 104C70 106 35 105 11 104C9 75 9 40 10 8Z" />
				<path d="M20 18H86V55H20Z" />
				<path d="M20 18L86 55M86 18L20 55" />
				<path d="M20 66C35 64 55 67 86 65" />
				<path d="M20 75C40 77 60 73 80 75" />
				<path d="M20 84C30 83 45 85 58 84" />
				<path d="M64 82H86V96H64Z" />
				<text x="88" y="118" fontSize="17" style={NOTE} fill="currentColor" stroke="none">
					v2
				</text>
				<path d="M84 104C96 100 108 104 106 112C104 120 88 120 85 113C83 108 88 104 95 104" />
			</>
		),
	},
	{
		// A note pointing at the photo beside it
		x: 73.5,
		y: 25,
		w: 10,
		r: -4,
		view: '0 0 130 100',
		art: (
			<>
				<text x="4" y="84" fontSize="23" style={NOTE} fill="currentColor" stroke="none">
					la lumière !
				</text>
				<path d="M62 60C70 34 96 22 122 30" />
				<path d="M110 22L123 30L111 39" />
			</>
		),
	},
	{
		// A pencil left on the desk, its line still trailing
		x: 26,
		y: 72,
		w: 10,
		r: -18,
		view: '0 0 150 70',
		art: (
			<>
				<path d="M30 26L118 24L119 38L31 40Z" />
				<path d="M30 26L10 34L31 40" />
				<path d="M10 34L16 32L16.5 36.5Z" fill="currentColor" />
				<path d="M104 24.5L105 38.5M110 24.3L111 38.4" />
				<path d="M119 24C127 24 128 38 119 38" />
				<path d="M8 50C20 58 34 46 46 54C58 62 70 50 82 57" />
			</>
		),
	},
	{
		// A note on the poster below, underlined twice, with an arrow down to it
		x: 63.5,
		y: 67,
		w: 9,
		r: -5,
		view: '0 0 130 100',
		art: (
			<>
				<text x="4" y="32" fontSize="25" style={NOTE} fill="currentColor" stroke="none">
					prototype
				</text>
				<path d="M6 41C30 38 62 40 96 37" />
				<path d="M12 48C36 45 58 47 84 45" />
				<path d="M98 46C110 56 116 70 118 88" />
				<path d="M109 80L118 90L125 79" />
			</>
		),
	},
	{
		// A star next to the work to keep
		x: 66.5,
		y: 19,
		w: 6,
		r: 6,
		view: '0 0 90 84',
		art: (
			<>
				<path d="M30 6L37 25L57 26L41 38L47 58L30 46L13 58L19 38L3 26L23 25Z" />
				<text x="14" y="78" fontSize="21" style={NOTE} fill="currentColor" stroke="none">
					à garder
				</text>
			</>
		),
	},
	{
		// The colours of the site, tried out as in a swatch book
		x: 86.5,
		y: 61,
		w: 9.5,
		r: 3,
		view: '0 0 130 80',
		art: (
			<>
				<path d="M8 14C20 8 34 10 36 22C38 34 26 40 14 37C4 34 2 20 8 14Z" fill="#6db0d9" fillOpacity="0.75" stroke="none" />
				<path d="M50 12C62 8 74 13 74 25C74 36 62 41 52 37C42 33 40 18 50 12Z" fill="#d6a046" fillOpacity="0.75" stroke="none" />
				<path d="M90 14C102 9 116 14 115 26C114 38 100 41 91 36C82 31 81 18 90 14Z" fill="#f08a4b" fillOpacity="0.75" stroke="none" />
				<text x="22" y="70" fontSize="19" style={NOTE} fill="currentColor" stroke="none">
					nuancier
				</text>
			</>
		),
	},
];

/** Same spreading out as the projects when the page scrolls, from where the drawing sits. */
function sketchStyle(s: (typeof SKETCHES)[number], i: number) {
	return {
		left: `${s.x}%`,
		top: `${s.y}%`,
		width: `${s.w}%`,
		'--dx': `${(s.x + s.w / 2 - 50) * 1.05}vw`,
		'--dy': `${(s.y + 6 - 50) * 1.05}svh`,
		transform: `translate(calc(var(--scroll, 0) * var(--dx)), calc(var(--scroll, 0) * var(--dy))) rotate(${s.r}deg)`,
		animationDelay: `${700 + i * 160}ms`,
	} as CSSProperties;
}

/**
 * Pencil drawings and notes scattered between the projects, so that the home screen looks
 * like an artist's desk. Only on computers: a phone has no room left between the projects.
 */
export default function HeroSketches() {
	return (
		<div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden text-ink/55 md:block">
			{/* Shakes the lines a little, as drawn by hand rather than with a ruler */}
			<svg className="absolute size-0">
				<filter id="pencil">
					<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
					<feDisplacementMap in="SourceGraphic" scale="2.2" />
				</filter>
			</svg>
			{SKETCHES.map((sketch, i) => (
				<svg
					key={i}
					viewBox={sketch.view}
					style={sketchStyle(sketch, i)}
					className="animate-sketch absolute h-auto overflow-visible motion-reduce:animate-none"
				>
					<g filter="url(#pencil)" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
						{sketch.art}
					</g>
				</svg>
			))}
		</div>
	);
}
