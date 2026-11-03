import ActionLink from '@/components/ui/action-link';
import { COPY, NAV, SITE } from '@/data/site';

export default function SiteFooter() {
	const socials = SITE.socials.filter((social) => social.href !== '#');

	return (
		<footer className="grain grain-dark bg-ink-deep text-paper">
			<div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 px-5 py-10 md:px-10 lg:flex-row lg:items-center">
				<div>
					<p className="font-display text-3xl tracking-wide">{SITE.name}</p>
					<p className="mt-1 max-w-md text-sm text-paper/65">{COPY.footer.description}</p>
				</div>
				<nav aria-label="Navigation de pied de page" className="flex flex-wrap gap-x-7 gap-y-2">
					{NAV.map((item) => (
						<ActionLink key={item.id} to={item.id} variant="quiet" className="border-transparent font-normal text-paper/75 hover:border-transparent hover:text-paper">
							{item.label}
						</ActionLink>
					))}
					{socials.map((social) => (
						<a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center py-1 text-sm text-paper/75 transition-colors hover:text-paper md:min-h-0">
							{social.label}
						</a>
					))}
				</nav>
				<p className="text-sm text-paper/65">© {new Date().getFullYear()} {SITE.name}</p>
			</div>
		</footer>
	);
}
