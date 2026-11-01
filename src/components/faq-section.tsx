import ActionLink from '@/components/ui/action-link';
import SectionHead from '@/components/ui/section-head';
import { COPY, FAQ } from '@/data/site';

export default function FaqSection() {
	return (
		<section aria-label={COPY.faq.title} className="border-t border-line">
			<div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
				<div>
					<SectionHead label={COPY.faq.label} title={COPY.faq.title} />
					<p className="mt-6 text-base text-slate">
						{COPY.faq.aside}{' '}
						<ActionLink to="contact" variant="quiet" className="min-h-0 font-normal">
							{COPY.faq.asideLink}
						</ActionLink>
						{COPY.faq.asideEnd}
					</p>
				</div>
				<div className="border-t border-line">
					{FAQ.map((item) => (
						<details key={item.q} className="group border-b border-line">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium leading-snug text-ink/80">
								{item.q}
								<span aria-hidden="true" className="font-sans text-xl font-normal text-accent-deep group-open:hidden">
									+
								</span>
								<span aria-hidden="true" className="hidden font-sans text-xl font-normal text-accent-deep group-open:inline">
									−
								</span>
							</summary>
							<p className="max-w-xl pb-6 text-base leading-relaxed text-slate">{item.a}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
