import { useMemo, useState } from 'react';
import Reveal from '@/components/ui/reveal';
import SectionHead from '@/components/ui/section-head';
import { projects } from '@/data/projects';
import { COPY } from '@/data/site';
import { cn } from '@/lib/utils';

export default function WorkSection({ onOpen }: { onOpen: (index: number) => void }) {
	const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], []);
	const [category, setCategory] = useState(categories[0]);
	const shown = projects
		.map((project, index) => ({ project, index }))
		.filter(({ project }) => project.category === category);

	return (
		// The negative margin slides this section over the pinned hero
		<section id="travaux" className="relative -mt-[100svh] scroll-mt-20 bg-paper motion-reduce:mt-0">
			<div className="mx-auto max-w-[1320px] px-5 pt-14 pb-20 md:px-10 md:pt-20 md:pb-32">
				<div className="grid gap-6 lg:grid-cols-2 lg:items-end">
					<SectionHead label={COPY.work.label} title={COPY.work.title} />
					<p className="max-w-md text-base leading-relaxed text-slate lg:justify-self-end">{COPY.work.text}</p>
				</div>

				<div role="group" aria-label="Filtrer par catégorie" className="mt-12 flex flex-wrap gap-x-7 gap-y-2 border-b border-line">
					{categories.map((name) => (
						<button
							key={name}
							type="button"
							onClick={() => setCategory(name)}
							aria-pressed={category === name}
							className={cn(
								'-mb-px cursor-pointer border-b py-3 text-sm first-letter:uppercase transition-colors',
								category === name ? 'border-ink text-ink' : 'border-transparent text-slate hover:text-ink'
							)}
						>
							{name}
						</button>
					))}
				</div>

				{/* On phones the projects scroll sideways, the next one peeking in, instead of making a long column */}
				<div className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 items-start gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:mt-12 sm:block sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 sm:columns-2 lg:columns-3">
					{shown.map(({ project, index }) => (
						<Reveal key={project.slug} className="w-[80%] shrink-0 snap-start sm:mb-8 sm:w-auto sm:break-inside-avoid">
							<button type="button" onClick={() => onOpen(index)} className="group block w-full cursor-pointer text-left">
								<span className="relative block overflow-hidden bg-limestone">
									<img
										src={project.cover.src}
										alt={project.cover.alt}
										width={project.cover.width}
										height={project.cover.height}
										loading="lazy"
										className="aspect-[4/5] h-auto w-full object-cover transition-transform sm:aspect-auto duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
									/>
									<span className="absolute inset-x-0 bottom-0 block bg-linear-to-t from-ink-deep/90 via-ink-deep/60 via-55% to-transparent px-5 pt-12 pb-3.5 text-paper">
										<span className="block font-display text-3xl leading-none tracking-wide text-balance transition-transform duration-300 ease-out group-hover:-translate-y-1 first-letter:uppercase motion-reduce:transform-none">
											{project.title}
										</span>
										<span className="mt-1 block text-sm text-paper/80 first-letter:uppercase">
											{[project.category, project.year].filter(Boolean).join(' · ')}
										</span>
									</span>
								</span>
							</button>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
