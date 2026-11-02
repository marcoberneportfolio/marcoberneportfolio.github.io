import Reveal from '@/components/ui/reveal';
import SectionHead from '@/components/ui/section-head';
import { CHANNELS, CLIENTS, COPY } from '@/data/site';
import { cn } from '@/lib/utils';

type Reference = { name: string; href: string; logo: string; role?: string; contain?: boolean; onDark?: boolean };

function ReferenceList({ title, items, linkLabel }: { title: string; items: Reference[]; linkLabel: string }) {
	return (
		<div className="mt-10 first-of-type:mt-10 sm:mt-14 sm:first-of-type:mt-12 md:first-of-type:mt-16">
			<h3 className="subtitle text-center sm:text-left">{title}</h3>
			{/* Three across on phones too, with smaller logos, so the section stays short */}
			<ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-8 sm:mt-8 sm:gap-10">
				{items.map((item) => (
					<li key={item.name}>
						<Reveal>
							<a href={item.href} target="_blank" rel="noreferrer" className="group flex flex-col items-center text-center">
								<span className="block rounded-full ring-1 ring-line ring-offset-4 ring-offset-paper transition duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-accent group-focus-visible:-translate-y-2 group-focus-visible:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-accent motion-reduce:transform-none">
									<img
										src={item.logo}
										alt={`Logo ${item.name}`}
										width={400}
										height={400}
										loading="lazy"
										className={cn(
											'size-20 rounded-full sm:size-32 md:size-40',
											item.contain ? 'object-contain p-3.5 sm:p-6' : 'object-cover',
											item.onDark ? 'bg-ink' : 'bg-paper'
										)}
									/>
								</span>
								<span className="mt-3 text-sm leading-tight font-medium text-ink/75 transition-colors duration-300 group-hover:text-accent-deep sm:mt-5 sm:text-base">{item.name}</span>
								{item.role && <span className="mt-1 text-xs leading-snug text-slate sm:text-sm">{item.role}</span>}
								<span className="mt-1 hidden text-sm text-slate transition-[opacity,transform] sm:block duration-300 ease-out md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100 motion-reduce:transform-none">
									{linkLabel}
								</span>
							</a>
						</Reveal>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function VideoSection() {
	return (
		<section id="references" className="mx-auto max-w-[1320px] scroll-mt-20 px-5 pb-20 md:px-10 md:pb-32">
			<div className="grid gap-6 border-t border-line pt-16 md:pt-20 lg:grid-cols-2 lg:items-end">
				<SectionHead label={COPY.video.label} title={COPY.video.title} />
				<p className="max-w-md text-base leading-relaxed text-slate lg:justify-self-end">{COPY.video.text}</p>
			</div>

			<ReferenceList title={COPY.video.clientsTitle} items={CLIENTS} linkLabel={COPY.video.siteLabel} />
			<ReferenceList title={COPY.video.channelsTitle} items={CHANNELS} linkLabel={COPY.video.linkLabel} />
		</section>
	);
}
