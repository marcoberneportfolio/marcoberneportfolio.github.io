import type { ReactNode } from 'react';
import { CV_FILE } from '@/data/site';
import { cn } from '@/lib/utils';

/** Button that downloads the PDF of the CV. */
export default function CvLink({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<a
			href={CV_FILE}
			download="CV Marco Berne.pdf"
			className={cn(
				'inline-flex items-center justify-center bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-accent-deep',
				className
			)}
		>
			{children}
		</a>
	);
}
