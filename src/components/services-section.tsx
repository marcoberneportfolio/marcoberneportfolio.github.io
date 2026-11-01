import SectionHead from '@/components/ui/section-head';
import { COPY, SERVICES } from '@/data/site';

export default function ServicesSection() {
	return (
		<section aria-labelledby="expertises" className="bg-limestone">
			<div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
				<SectionHead label={COPY.services.label} title={COPY.services.title} />
				<ul className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
					{SERVICES.map((service) => (
						<li key={service} className="border-b border-line py-4 text-base">
							{service}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
