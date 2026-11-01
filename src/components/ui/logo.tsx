import { SITE } from '@/data/site';
import { cn } from '@/lib/utils';

/** MB monogram: the M rises into the back of a taller B, whose lower arm stops short of the upright. */
export default function Logo({ className }: { className?: string }) {
	return (
		<svg viewBox="160 160 938 915" fill="currentColor" role="img" aria-label={SITE.name} className={cn('block h-12 w-auto', className)}>
			<path
				fillRule="evenodd"
				d="M160 322H308L468 668L636 376V160H860C985 160 1063 245 1063 355C1063 435 1020 488 950 510C1040 537 1098 612 1098 720C1098 850 1000 933 850 933H765V832H845C925 832 968 790 968 715C968 625 925 573 848 573H747V1074H636V583L441 922L262 507V1075H160ZM747 266H858C915 266 940 300 940 355C940 430 905 467 848 467H747Z"
			/>
		</svg>
	);
}
