import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import ActionLink from '@/components/ui/action-link';
import CvLink from '@/components/ui/cv-link';
import { projects, type Project } from '@/data/projects';
import { COPY, CV, SITE } from '@/data/site';
import { cn } from '@/lib/utils';

const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Where each project lands: x, y and width in % of the screen on a computer, around
// the name in the middle; m is the same on a phone, where only the first six appear
const SPOTS = [
	{ x: 1.5, y: 13, w: 12, r: -3, m: [-4, 9, 34] },
	{ x: 86, y: 15, w: 12.5, r: -2, m: [31, 7, 31] },
	{ x: 15, y: 18, w: 9.5, r: 2, m: [68, 10, 36] },
	{ x: 74, y: 11, w: 10, r: 2, m: [-5, 79, 36] },
	{ x: 3, y: 44, w: 10.5, r: 2, m: [31, 83, 32] },
	{ x: 87, y: 47, w: 11, r: 2, m: [68, 78, 36] },
	{ x: 15.5, y: 50, w: 10, r: -2 },
	{ x: 74.5, y: 42, w: 10.5, r: -3 },
	{ x: 1, y: 75, w: 12, r: -2 },
	{ x: 75, y: 74, w: 11, r: 2 },
	{ x: 15, y: 83, w: 10, r: 3 },
	{ x: 87.5, y: 80, w: 10.5, r: -3 },
	{ x: 33, y: -16, w: 11, r: 3 },
	{ x: 55, y: -14, w: 11, r: -2 },
	{ x: 37, y: 89, w: 12, r: -2 },
	{ x: 54, y: 90, w: 10, r: 2 },
];

/** One project of each category in turn, so that the home screen shows the whole range. */
function pickProjects() {
	const groups = [...new Set(projects.map((p) => p.category))].map((category) => projects.filter((p) => p.category === category));
	const picks: Project[] = [];
	for (let round = 0; picks.length < Math.min(SPOTS.length, projects.length); round++) {
		for (const group of groups) if (group[round] && picks.length < SPOTS.length) picks.push(group[round]);
	}
	return picks;
}
const PICKS = pickProjects();

/** Position of a card, read from CSS variables so that phones and computers can differ. */
function spotStyle(spot: (typeof SPOTS)[number]) {
	const [mx = 0, my = 0, mw = 0] = spot.m ?? [];
	return {
		'--x': `${spot.x}%`,
		'--y': `${spot.y}%`,
		'--w': `${spot.w}%`,
		'--mx': `${mx}%`,
		'--my': `${my}%`,
		'--mw': `${mw}%`,
		'--dx': `${(spot.x + spot.w / 2 - 50) * 1.05}vw`,
		'--dy': `${(spot.y + 10 - 50) * 1.05}svh`,
		'--mdx': `${(mx + mw / 2 - 50) * 1.05}vw`,
		'--mdy': `${(my + 10 - 50) * 1.05}svh`,
		transform: `translate(calc(var(--scroll, 0) * var(--tx)), calc(var(--scroll, 0) * var(--ty))) rotate(${spot.r}deg)`,
	} as CSSProperties;
}

/**
 * Projects scattered around the name, pinned while the page scrolls: as it moves
 * they spread out of the screen and the text fades before the next section. The
 * scroll position only updates CSS variables, so React never re-renders.
 */
export default function HeroSection({ onOpen }: { onOpen: (index: number) => void }) {
	const root = useRef<HTMLElement>(null);
	const text = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const el = root.current;
		if (!el || prefersStill()) return;
		let frame = 0;

		const update = () => {
			frame = 0;
			const range = el.offsetHeight - window.innerHeight;
			const p = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
			el.style.setProperty('--scroll', String(p));
			el.style.setProperty('--fade', String(Math.max(0, 1 - p * 1.8)));
			el.style.setProperty('--rise', `${-70 * p}px`);
			if (text.current) text.current.style.visibility = p > 0.6 ? 'hidden' : '';
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return (
		<section ref={root} id="hero" aria-label="Présentation" className="relative h-[130svh] bg-limestone motion-reduce:h-svh">
			<div className="sticky top-0 h-svh overflow-hidden">
				{PICKS.map((project, i) => (
					<button
						key={project.slug}
						type="button"
						onClick={() => onOpen(projects.indexOf(project))}
						aria-label={`Voir le projet ${project.title}`}
						style={spotStyle(SPOTS[i])}
						className={cn(
							'absolute top-[var(--my)] left-[var(--mx)] w-[var(--mw)] cursor-pointer [--tx:var(--mdx)] [--ty:var(--mdy)] hover:z-10 md:top-[var(--y)] md:left-[var(--x)] md:w-[var(--w)] md:[--tx:var(--dx)] md:[--ty:var(--dy)]',
							i >= 6 && 'hidden md:block'
						)}
					>
						<img
							src={project.cover.thumb ?? project.cover.src}
							alt=""
							decoding="async"
							loading={i >= 6 ? 'lazy' : undefined}
							className="animate-scatter block max-h-[13svh] w-full bg-paper object-cover shadow-lg transition-transform duration-300 ease-out hover:scale-105 motion-reduce:animate-none md:max-h-[36svh]"
							style={{ animationDelay: `${i * 70}ms` }}
						/>
					</button>
				))}

				<div
					ref={text}
					className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
					style={{ opacity: 'var(--fade, 1)', transform: 'translateY(var(--rise, 0px))', pointerEvents: 'none' }}
				>
					<p className="eyebrow">{COPY.intro.label}</p>
					<h1 className="mt-4 text-7xl leading-[0.9] sm:text-8xl">{SITE.name}</h1>
					<p className="mt-3 font-display text-2xl leading-tight tracking-wide text-accent-deep sm:text-3xl md:text-4xl">{COPY.intro.role}</p>
					<p className="mt-2 text-sm font-medium">{COPY.intro.availability}</p>
					<p className="mt-5 hidden max-w-lg text-base leading-relaxed text-slate sm:block [@media(max-height:700px)]:hidden">{COPY.intro.text}</p>
					<div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
						<CvLink>{CV.download}</CvLink>
						<ActionLink to="contact" variant="quiet">
							{COPY.intro.primaryCta}
						</ActionLink>
						<ActionLink to="travaux" variant="quiet">
							{COPY.intro.secondaryCta}
						</ActionLink>
					</div>
				</div>
			</div>
		</section>
	);
}
