import { useEffect, useState } from 'react';
import ActionLink from '@/components/ui/action-link';
import CvLink from '@/components/ui/cv-link';
import Logo from '@/components/ui/logo';
import { COPY, CV, NAV } from '@/data/site';
import { cn } from '@/lib/utils';

/** Whether the projects have come up the screen, from where the bar slides in. */
function useProjectsReached() {
	const [reached, setReached] = useState(false);

	useEffect(() => {
		const projects = document.getElementById('travaux');
		if (!projects) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			setReached(projects.getBoundingClientRect().top < window.innerHeight * 0.3);
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

	return reached;
}

export default function SiteHeader() {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	// Out of the way on the home screen, which has its own buttons; back with the projects
	const shown = useProjectsReached() || open;

	return (
		<header
			className={cn(
				'fixed inset-x-0 top-0 z-40 border-b border-line bg-paper transition-transform duration-500 ease-out focus-within:translate-y-0 motion-reduce:transition-none',
				!shown && '-translate-y-full'
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
				<nav id="menu-mobile" aria-label="Navigation mobile" className="flex flex-col border-t border-line bg-paper px-5 pb-6 md:hidden">
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
