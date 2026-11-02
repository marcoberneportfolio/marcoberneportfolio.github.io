import { useEffect, useRef } from 'react';

// Where the system cursor stays, to type or to use the player of an embedded video
const NATIVE = 'input, textarea, select, iframe';

/**
 * The cursor of the site on a computer: a small night blue dot that follows
 * the mouse, and shrinks a little on a click. Phones keep their touch.
 * The position only goes through the style of the dot, so React never re-renders.
 */
export default function SiteCursor() {
	const dot = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = dot.current;
		if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
		const root = document.documentElement;

		const onMove = (event: PointerEvent) => {
			if (event.pointerType !== 'mouse') return;
			// Only hidden once the mouse moves, so the dot never stands alone in a corner
			root.classList.add('has-cursor');
			const target = event.target as Element;
			el.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
			el.dataset.hidden = String(!!target.closest?.(NATIVE));
		};
		const onLeave = () => (el.dataset.hidden = 'true');
		const onDown = () => (el.dataset.down = 'true');
		const onUp = () => (el.dataset.down = 'false');

		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('pointerdown', onDown);
		window.addEventListener('pointerup', onUp);
		document.addEventListener('mouseleave', onLeave);
		// The mouse entering a video player is no longer seen by the page
		window.addEventListener('blur', onLeave);
		return () => {
			root.classList.remove('has-cursor');
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointerup', onUp);
			document.removeEventListener('mouseleave', onLeave);
			window.removeEventListener('blur', onLeave);
		};
	}, []);

	return (
		<div ref={dot} aria-hidden="true" data-hidden="true" className="group pointer-events-none fixed top-0 left-0 z-[100] hidden [.has-cursor_&]:block">
			{/* Night blue of the name, edged in white so it still shows on the photos and dark sections */}
			<div className="size-4 -translate-1/2 rounded-full bg-ink shadow-[0_0_0_1.5px_rgb(255_255_255/0.85)] transition-[opacity,scale] duration-200 ease-out group-data-[down=true]:scale-75 group-data-[hidden=true]:opacity-0" />
		</div>
	);
}
