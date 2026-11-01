import type { ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

/** Fades content in, very gently, when it enters the view. */
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
	const [ref, inView] = useInView<HTMLDivElement>(0.1);
	return (
		<div
			ref={ref}
			className={cn(
				'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
				inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
				className
			)}
		>
			{children}
		</div>
	);
}
