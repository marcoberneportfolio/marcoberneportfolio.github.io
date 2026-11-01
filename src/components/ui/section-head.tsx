import { cn } from '@/lib/utils';

/** Label + serif title used at the top of every section. */
export default function SectionHead({
	label,
	title,
	className,
	inverted = false,
}: {
	label: string;
	title: string;
	className?: string;
	inverted?: boolean;
}) {
	return (
		<div className={className}>
			<p className={cn('eyebrow', inverted && 'text-accent-soft')}>{label}</p>
			<h2 className="mt-4 text-4xl leading-[1.08] md:text-5xl lg:text-[3.5rem]">{title}</h2>
		</div>
	);
}
