import type { CSSProperties } from 'react';
import SectionHead from '@/components/ui/section-head';
import { COPY, SERVICES, TOOLS } from '@/data/site';
import { TOOL_ICONS } from '@/data/tool-icons';

/** Logos of the tools used for one expertise: the tools whose group is that expertise's name. */
function ToolLogos({ service }: { service: string }) {
	const tools = TOOLS.filter((tool) => tool.group === service && TOOL_ICONS[tool.name]);
	if (!tools.length) return null;
	return (
		<ul aria-label={`Outils : ${tools.map((tool) => tool.name).join(', ')}`} className="flex shrink-0 items-center gap-2.5">
			{tools.map((tool) => {
				const icon = TOOL_ICONS[tool.name];
				return (
					// Focusable so that a tap on a phone shows the name too
					<li key={tool.name} tabIndex={0} style={{ '--brand': icon.color } as CSSProperties} className="group/tool relative outline-offset-4">
						<svg
							viewBox={icon.viewBox}
							aria-hidden="true"
							className="size-5 fill-ink/70 transition duration-300 ease-out group-hover/tool:-translate-y-0.5 group-hover/tool:scale-125 group-hover/tool:fill-(--brand) group-focus/tool:fill-(--brand) motion-reduce:transform-none"
						>
							<path d={icon.path} fillRule={icon.evenOdd ? 'evenodd' : undefined} />
						</svg>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute right-1/2 bottom-full z-10 mb-2 translate-x-1/2 translate-y-1 bg-ink px-2 py-1 text-xs whitespace-nowrap text-paper opacity-0 transition duration-200 ease-out group-hover/tool:translate-y-0 group-hover/tool:opacity-100 group-focus/tool:translate-y-0 group-focus/tool:opacity-100"
						>
							{tool.name}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

export default function ServicesSection() {
	return (
		<section aria-labelledby="expertises" className="grain bg-limestone">
			<div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
				<SectionHead label={COPY.services.label} title={COPY.services.title} />
				<ul className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
					{SERVICES.map((service) => (
						<li key={service} className="flex items-center justify-between gap-4 border-b border-line py-4 text-base">
							{service}
							<ToolLogos service={service} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
