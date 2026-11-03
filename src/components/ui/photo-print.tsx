import { useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// How far the print leans towards the mouse, in degrees on each axis
const TILT = 8;

/**
 * A photograph shown as a paper print: white margin, short shadow, turned a little.
 * Under the mouse it leans towards it and lifts; the tilt only goes through CSS
 * variables, so React never re-renders.
 */
export default function PhotoPrint({ children, rotate = 0, className }: { children: ReactNode; rotate?: number; className?: string }) {
	const print = useRef<HTMLDivElement>(null);

	const onMove = (event: PointerEvent) => {
		const el = print.current;
		if (!el || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const box = el.getBoundingClientRect();
		const x = (event.clientX - box.left) / box.width - 0.5;
		const y = (event.clientY - box.top) / box.height - 0.5;
		el.style.setProperty('--ry', `${x * 2 * TILT}deg`);
		el.style.setProperty('--rx', `${-y * 2 * TILT}deg`);
		el.dataset.lifted = 'true';
	};

	const onLeave = () => {
		const el = print.current;
		if (!el) return;
		el.style.setProperty('--rx', '0deg');
		el.style.setProperty('--ry', '0deg');
		el.dataset.lifted = 'false';
	};

	return (
		<div className={cn('perspective-[900px]', className)}>
			<div
				ref={print}
				onPointerMove={onMove}
				onPointerLeave={onLeave}
				style={{ transform: `rotate(${rotate}deg) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))` }}
				className="bg-paper p-2.5 shadow-print transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[lifted=true]:shadow-print-lift data-[lifted=true]:duration-150 sm:p-3.5"
			>
				{children}
			</div>
		</div>
	);
}
