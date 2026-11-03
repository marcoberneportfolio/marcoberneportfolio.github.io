import { useRef } from 'react';
import Camera3D from '@/components/camera-3d';
import ActionLink from '@/components/ui/action-link';
import CvLink from '@/components/ui/cv-link';
import PhotoPrint from '@/components/ui/photo-print';
import Reveal from '@/components/ui/reveal';
import SectionHead from '@/components/ui/section-head';
import { media } from '@/data/media';
import { COPY, CV, SITE } from '@/data/site';

export default function AboutSection() {
	const flash = useRef<HTMLSpanElement>(null);

	// Clicking the camera takes the portrait: a short white flash over it
	const onShutter = () => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		flash.current?.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: 320, easing: 'ease-out' });
	};

	return (
		<section id="apropos" className="grain scroll-mt-20 overflow-x-clip bg-limestone">
			<div className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-28">
				<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
					{/* The portrait as a print on the desk, the camera that took it set down at its corner */}
					<div className="relative max-w-md pb-10 lg:max-w-none lg:pb-0">
						<PhotoPrint rotate={-2}>
							<span className="relative block">
								<img src={media.about.src} alt={`Portrait de ${SITE.name}`} loading="lazy" className="block aspect-[4/5] w-full object-cover object-top" />
								<span ref={flash} className="absolute inset-0 bg-paper opacity-0" />
							</span>
						</PhotoPrint>
						<Camera3D onShutter={onShutter} className="absolute -right-4 -bottom-6 origin-bottom-right scale-[0.55] sm:-right-24 sm:scale-[0.7] lg:-right-20 lg:-bottom-16 lg:scale-75" />
					</div>
					<Reveal>
						<SectionHead label={COPY.about.label} title={COPY.about.title} />
						<p className="mt-7 max-w-xl text-lg leading-relaxed text-slate">{COPY.about.text}</p>
						<h3 className="subtitle mt-9">{COPY.about.pathTitle}</h3>
						<p className="mt-2 max-w-xl text-base leading-relaxed text-slate">{COPY.about.path}</p>
						<div className="mt-9 flex flex-wrap gap-3">
							<ActionLink to="contact">{COPY.about.cta}</ActionLink>
							<CvLink className="border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper">{CV.download}</CvLink>
						</div>
					</Reveal>
				</div>

				<div className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
					<div>
						<h3 className="subtitle">{COPY.about.visionTitle}</h3>
						<p className="mt-3 text-base leading-relaxed text-slate">{COPY.about.vision}</p>
					</div>
					<div>
						<h3 className="subtitle">{COPY.about.missionTitle}</h3>
						<p className="mt-3 text-base leading-relaxed text-slate">{COPY.about.mission}</p>
						<ul className="mt-6 flex flex-wrap gap-x-2 text-sm font-medium text-accent-deep">
							{COPY.about.values.map((value, i) => (
								<li key={value}>
									{i > 0 && <span aria-hidden="true" className="mr-2">·</span>}
									{value}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
