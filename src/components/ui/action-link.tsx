import type { MouseEvent, ReactNode } from 'react';
import { scrollToSection } from '@/lib/scroll';
import { cn } from '@/lib/utils';

/** Link to a section of the page, as a solid button or a quiet underlined link. */
export default function ActionLink({
	to,
	children,
	variant = 'solid',
	className,
	onNavigate,
}: {
	to: string;
	children: ReactNode;
	variant?: 'solid' | 'quiet';
	className?: string;
	onNavigate?: () => void;
}) {
	const onClick = (event: MouseEvent) => {
		event.preventDefault();
		onNavigate?.();
		// Once the menu or project sheet has closed, so the section is measured in its final place
		requestAnimationFrame(() => scrollToSection(to));
	};

	return (
		<a
			href={`#${to}`}
			onClick={onClick}
			className={cn(
				'inline-flex items-center justify-center text-sm font-medium transition-colors duration-200',
				variant === 'solid'
					? 'bg-ink px-6 py-3.5 text-paper hover:bg-accent-deep'
					: 'min-h-11 border-b border-ink/30 py-1 text-ink hover:border-ink md:min-h-0',
				className
			)}
		>
			{children}
		</a>
	);
}
