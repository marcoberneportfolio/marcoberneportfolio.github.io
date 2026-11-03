import { useLayoutEffect, useRef, useState } from 'react';
import ActionLink from '@/components/ui/action-link';
import CvLink from '@/components/ui/cv-link';
import Logo from '@/components/ui/logo';
import { COPY, CV, NAV } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Whether the bar has reached the top of the screen. The bar itself is moved by the browser
 * (it is sticky), so this only tells which way the phone menu unfolds.
 */
function useDocked() {
	const bar = useRef<HTMLElement>(null);
	const [docked, setDocked] = useState(false);

	useLayoutEffect(() => {
		const el = bar.current;
		if (!el) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			setDocked(el.getBoundingClientRect().top <= 0);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return { bar, docked };
}

export default function SiteHeader() {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const { bar, docked } = useDocked();

	return (
		// Placed in the page along the bottom of the home screen, right above the projects: it
		// rises with them as the page scrolls, then sticks to the top for the rest of the page
		<header
			ref={bar}
			className={cn(
				'sticky top-0 z-40 -mt-[calc(100svh+72px)] border-line bg-paper motion-reduce:-mt-[72px]',
				docked ? 'border-b' : 'border-t'
			)}
		>
			<div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-10">
				<ActionLink to="top" variant="quiet" onNavigate={close} className="group/logo border-0 py-0">
					<Logo />
				</ActionLink>

				<nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
					{/* The button next to these links already leads to the contact section */}
					{NAV.filter((item) => item.id !== 'contact').map((item) => (
						<ActionLink key={item.id} to={item.id} variant="quiet" className="border-transparent font-normal text-slate hover:text-ink">
							{item.label}
						</ActionLink>
					))}
					<ActionLink to="contact" className="px-5 py-2.5">
						{COPY.header.cta}
					</ActionLink>
				</nav>

				<button
					type="button"
					onClick={() => setOpen((value) => !value)}
					aria-expanded={open}
					aria-controls="menu-mobile"
					className="-mr-2 min-h-11 min-w-11 p-2 text-sm font-medium md:hidden"
				>
					{open ? 'Fermer' : 'Menu'}
				</button>
			</div>

			{open && (
				// Unfolds below the bar at the top, and above it while it still sits at the bottom
				<nav
					id="menu-mobile"
					aria-label="Navigation mobile"
					className={cn(
						'absolute inset-x-0 flex flex-col border-line bg-paper px-5 pb-6 md:hidden',
						docked ? 'top-full border-y' : 'bottom-full border-t'
					)}
				>
					{NAV.map((item) => (
						<ActionLink
							key={item.id}
							to={item.id}
							variant="quiet"
							onNavigate={close}
							className="justify-start border-0 border-b border-line py-4 font-display text-3xl font-normal tracking-wide"
						>
							{item.label}
						</ActionLink>
					))}
					<CvLink className="mt-6">{CV.download}</CvLink>
				</nav>
			)}
		</header>
	);
}
