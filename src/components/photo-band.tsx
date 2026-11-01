import { projects, type Project } from '@/data/projects';

// The photographs shown, in order; a slug that no longer exists is skipped
const FEATURED = [
	'hors-serie-drole-de-vie',
	'le-cuisinier-pendant-sa-pause',
	'fragment-d-humanite',
	'serie-de-portraits-2-3',
	'fete-de-la-musique-2026',
	'legerete-de-l-enfance',
	'marcher-ensemble',
	'regards-de-rue',
	'serie-de-portraits-1-3',
	'moments-en-suspens',
];

const photos = FEATURED.map((slug) => ({ project: projects.find((p) => p.slug === slug), index: projects.findIndex((p) => p.slug === slug) })).filter(
	(photo): photo is { project: Project; index: number } => photo.project !== undefined
);

/** Strip of photographs drifting sideways; the second copy makes the loop seamless. */
export default function PhotoBand({ onOpen }: { onOpen: (index: number) => void }) {
	return (
		<section aria-label="Galerie de photographies" className="group/band overflow-x-auto bg-limestone motion-safe:overflow-hidden">
			<div className="flex w-max gap-2 motion-safe:animate-drift motion-safe:group-hover/band:[animation-play-state:paused] motion-safe:group-focus-within/band:[animation-play-state:paused]">
				{[false, true].map((copy) =>
					photos.map(({ project, index }) => (
						<button
							key={`${project.slug}-${copy}`}
							type="button"
							onClick={() => onOpen(index)}
							aria-label={`Voir le projet ${project.title}`}
							aria-hidden={copy || undefined}
							tabIndex={copy ? -1 : undefined}
							className="h-64 flex-none cursor-pointer overflow-hidden motion-reduce:[&[aria-hidden]]:hidden md:h-96"
						>
							<img
								src={project.cover.thumb ?? project.cover.src}
								alt=""
								width={project.cover.width}
								height={project.cover.height}
								loading="lazy"
								className="h-full w-auto transition-transform duration-500 ease-out hover:scale-[1.03] motion-reduce:transform-none"
							/>
						</button>
					))
				)}
			</div>
		</section>
	);
}
