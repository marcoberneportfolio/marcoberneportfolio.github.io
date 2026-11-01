import { useEffect, useRef, useState } from 'react';
import ActionLink from '@/components/ui/action-link';
import CvLink from '@/components/ui/cv-link';
import { projects, type ProjectImage } from '@/data/projects';
import { COPY, CV } from '@/data/site';
import { cn } from '@/lib/utils';

/** Plays a video; vertical ones (reels) sit in a sober phone frame. */
function ProjectVideo({ item }: { item: ProjectImage }) {
	const [vertical, setVertical] = useState(true);

	return (
		<div className={cn('relative mx-auto max-w-full', vertical ? 'w-fit rounded-[2.6rem] bg-ink-deep p-2.5 shadow-xl' : 'w-full')}>
			{vertical && <span aria-hidden="true" className="absolute top-5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink-deep" />}
			<video
				src={item.src}
				controls
				playsInline
				onLoadedMetadata={(event) => setVertical(event.currentTarget.videoHeight > event.currentTarget.videoWidth)}
				aria-label={item.alt || 'Vidéo du projet'}
				className={cn('block max-w-full bg-ink', vertical ? 'max-h-[78vh] w-auto rounded-[2.1rem]' : 'w-full')}
			/>
		</div>
	);
}

function Media({ item }: { item: ProjectImage }) {
	if (item.type === 'embed') {
		return <iframe src={item.src} title={item.alt || 'Vidéo du projet'} allowFullScreen className="aspect-video w-full" />;
	}
	if (item.type === 'video') return <ProjectVideo item={item} />;
	return <img src={item.src} alt={item.alt} loading="lazy" className="h-auto w-full" />;
}

export default function ProjectModal({
	index,
	onClose,
	onNavigate,
}: {
	index: number | null;
	onClose: () => void;
	onNavigate: (index: number) => void;
}) {
	const panel = useRef<HTMLDivElement>(null);
	const closeButton = useRef<HTMLButtonElement>(null);
	const isOpen = index !== null;

	useEffect(() => {
		if (!isOpen) return;
		const previous = document.activeElement as HTMLElement | null;
		document.documentElement.style.overflow = 'hidden';
		closeButton.current?.focus();
		return () => {
			document.documentElement.style.overflow = '';
			previous?.focus();
		};
	}, [isOpen]);

	useEffect(() => {
		panel.current?.scrollTo(0, 0);
		if (index === null) return;
		const step = (delta: number) => onNavigate((index + delta + projects.length) % projects.length);
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
			if (event.key === 'ArrowRight') step(1);
			if (event.key === 'ArrowLeft') step(-1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [index, onClose, onNavigate]);

	if (index === null) return null;
	const project = projects[index];
	if (!project) return null;
	const previous = (index - 1 + projects.length) % projects.length;
	const next = (index + 1) % projects.length;
	// Social media projects open straight on their video: the cover only serves the grid
	const videoOnly = project.category === 'Réseaux sociaux' && project.gallery.some((item) => item.type === 'video' || item.type === 'embed');
	const details =[...(project.year ? [{ label: 'Année', value: String(project.year) }] : []), { label: 'Catégorie', value: project.category }, ...project.details];

	return (
		<div ref={panel} role="dialog" aria-modal="true" aria-labelledby="projet-titre" className="fixed inset-0 z-50 overflow-y-auto bg-paper">
			<div className="sticky top-0 z-10 border-b border-line bg-paper">
				<div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-10">
					<p className="text-sm text-slate tabular-nums">
						Projet {index + 1} sur {projects.length}
					</p>
					<button ref={closeButton} type="button" onClick={onClose} className="cursor-pointer border-b border-ink/30 py-1 text-sm font-medium hover:border-ink">
						Fermer
					</button>
				</div>
			</div>

			<div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-10 md:px-10 md:py-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
				<div className="order-2 flex flex-col gap-6 lg:order-1">
					{!videoOnly && <Media item={project.cover} />}
					{project.gallery.map((item) => (
						<Media key={item.src} item={item} />
					))}
				</div>

				<div className="order-1 self-start lg:sticky lg:top-[128px] lg:order-2">
					<h2 id="projet-titre" className="text-5xl leading-[1.05] first-letter:uppercase md:text-6xl">
						{project.title}
					</h2>
					{project.summary && <p className="mt-5 text-xl leading-snug text-accent-deep">{project.summary}</p>}
					{project.description.map((paragraph) => (
						<p key={paragraph} className="mt-4 text-base leading-relaxed text-slate">
							{paragraph}
						</p>
					))}

					<dl className="mt-8 border-t border-line">
						{details.map((detail) => (
							<div key={detail.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-b border-line py-3 text-sm">
								<dt className="text-slate">{detail.label}</dt>
								<dd className="first-letter:uppercase">{detail.value}</dd>
							</div>
						))}
					</dl>

					<div className="mt-8 flex justify-between gap-6 text-sm font-medium">
						<button type="button" onClick={() => onNavigate(previous)} className="cursor-pointer border-b border-ink/30 py-1 hover:border-ink">
							Précédent
						</button>
						<button type="button" onClick={() => onNavigate(next)} className="cursor-pointer border-b border-ink/30 py-1 hover:border-ink">
							Suivant
						</button>
					</div>
				</div>
			</div>

			<div className="border-t border-line bg-limestone">
				<div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
					<p className="font-display text-3xl tracking-wide">{COPY.project.cta}</p>
					<div className="flex flex-wrap items-center gap-x-7 gap-y-3">
						<CvLink>{CV.download}</CvLink>
						<ActionLink to="contact" variant="quiet" onNavigate={onClose}>
							{COPY.intro.primaryCta}
						</ActionLink>
						<button type="button" onClick={() => onNavigate(next)} className="min-h-11 cursor-pointer border-b border-ink/30 py-1 text-sm font-medium hover:border-ink md:min-h-0">
							Projet suivant
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
