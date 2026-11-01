import ActionLink from '@/components/ui/action-link';
import Reveal from '@/components/ui/reveal';
import SectionHead from '@/components/ui/section-head';
import { media } from '@/data/media';
import { COPY, SITE } from '@/data/site';

export default function AboutSection() {
	return (
		<section id="apropos" className="scroll-mt-20 bg-limestone">
			<div className="mx-auto max-w-[1320px] px-5 py-20 md:px-10 md:py-28">
				<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
					<img
						src={media.about.src}
						alt={`Portrait de ${SITE.name}`}
						loading="lazy"
						className="aspect-[4/5] w-full max-w-md object-cover object-top lg:max-w-none"
					/>
					<Reveal>
						<SectionHead label={COPY.about.label} title={COPY.about.title} />
						<p className="mt-7 max-w-xl text-lg leading-relaxed text-slate">{COPY.about.text}</p>
						<h3 className="subtitle mt-9">{COPY.about.pathTitle}</h3>
						<p className="mt-2 max-w-xl text-base leading-relaxed text-slate">{COPY.about.path}</p>
						<ActionLink to="contact" className="mt-9">
							{COPY.about.cta}
						</ActionLink>
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
