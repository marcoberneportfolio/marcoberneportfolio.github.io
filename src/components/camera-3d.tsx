import { useEffect, useRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

// Body of the camera, in px, centred on the origin
const W = 240;
const H = 140;
const D = 56;
// Turn at rest, three quarters from above, and how far it turns towards the mouse
const REST = { x: -12, y: -24 };
const TURN = 28;

const at = (transform: string, width: number, height: number, style?: CSSProperties): CSSProperties => ({
	position: 'absolute',
	left: 0,
	top: 0,
	width,
	height,
	transformStyle: 'preserve-3d',
	transform: `translate(-50%, -50%) ${transform}`,
	...style,
});

// Night blue leatherette under a top plate of limestone, as on a rangefinder
const FACE: CSSProperties = {
	backfaceVisibility: 'hidden',
	backgroundColor: 'var(--color-ink)',
	backgroundImage:
		'linear-gradient(var(--color-limestone) 0 38px, var(--color-line) 38px 40px, transparent 40px), radial-gradient(rgb(255 255 255 / 0.07) 0.8px, transparent 1.2px)',
	backgroundSize: '100% 100%, 3px 3px',
};

/** A cylinder as a stack of discs, along z for the lens or upwards for the dials. */
function Discs({ x, y, z, r, length, axis, paint }: { x: number; y: number; z: number; r: number; length: number; axis: 'z' | 'y'; paint: (i: number, last: boolean) => string }) {
	return Array.from({ length: length + 1 }, (_, i) => (
		<div
			key={i}
			style={at(axis === 'z' ? `translate3d(${x}px, ${y}px, ${z + i}px)` : `translate3d(${x}px, ${y - i}px, ${z}px) rotateX(90deg)`, r * 2, r * 2, {
				borderRadius: '50%',
				background: paint(i, i === length),
			})}
		/>
	));
}

function Window({ left, top, width, height }: { left: number; top: number; width: number; height: number }) {
	return (
		<span className="absolute bg-ink-deep shadow-[inset_0_0_0_2px_var(--color-line)]" style={{ left, top, width, height }}>
			<span className="absolute inset-1 bg-linear-135 from-accent-soft to-ink to-70% opacity-80" />
		</span>
	);
}

/**
 * A rangefinder camera in CSS 3D, in the colours of the site: it turns towards the
 * mouse and sways slowly at rest. Clicking it fires the shutter (onShutter). Only
 * animated while on screen; still, at three quarters, when motion is reduced.
 */
export default function Camera3D({ className, onShutter }: { className?: string; onShutter?: () => void }) {
	const stage = useRef<HTMLDivElement>(null);
	const body = useRef<HTMLDivElement>(null);
	const shadow = useRef<HTMLDivElement>(null);
	const release = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = stage.current;
		if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let rx = REST.x;
		let ry = REST.y;
		let target: { x: number; y: number } | null = null;
		let frame = 0;
		const start = performance.now();

		const tick = (now: number) => {
			const s = (now - start) / 1000;
			const tx = target?.x ?? REST.x + Math.sin(s * 0.4) * 3;
			const ty = target?.y ?? Math.sin(s * 0.6) * 22 - 6;
			rx += (tx - rx) * 0.08;
			ry += (ty - ry) * 0.08;
			body.current?.style.setProperty('transform', `rotateX(${rx}deg) rotateY(${ry}deg)`);
			shadow.current?.style.setProperty('transform', `translateX(${ry * -0.8}px) scaleX(${1 - Math.abs(ry) / 200})`);
			frame = requestAnimationFrame(tick);
		};

		// The mouse anywhere on the screen steers it, so it seems to look at the visitor
		const onMove = (event: PointerEvent) => {
			if (event.pointerType !== 'mouse') return;
			const box = el.getBoundingClientRect();
			const dx = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
			const dy = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2);
			target = { x: REST.x - Math.max(-1, Math.min(1, dy)) * 9, y: Math.max(-1, Math.min(1, dx)) * TURN };
		};
		const onLeave = () => (target = null);

		const observer = new IntersectionObserver(([entry]) => {
			cancelAnimationFrame(frame);
			if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
		});
		observer.observe(el);
		window.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('mouseleave', onLeave);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('mouseleave', onLeave);
		};
	}, []);

	const shoot = () => {
		const button = release.current;
		if (button) {
			button.style.translate = '0 3px';
			setTimeout(() => (button.style.translate = ''), 140);
		}
		onShutter?.();
	};

	return (
		<div ref={stage} aria-hidden="true" onClick={shoot} className={cn('relative grid h-[260px] w-[320px] cursor-pointer place-items-center perspective-[900px] select-none', className)}>
			<div ref={shadow} className="absolute top-[200px] left-[30px] h-8 w-[260px] rounded-full bg-ink-deep/30 blur-[14px]" />
			<div ref={body} style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${REST.x}deg) rotateY(${REST.y}deg)` }}>
				<div style={at(`translateZ(${D / 2}px)`, W, H, FACE)}>
					<Window left={14} top={10} width={40} height={22} />
					<Window left={186} top={12} width={20} height={18} />
					<svg viewBox="145 139 784 721" className="absolute top-[11px] left-[108px] h-4 w-auto">
						<path fill="var(--color-ink)" d="M145 264H255L405.5 540L531.6 264H644V860H552.6V419L405.9 705.5L236 417V860H145Z" />
						<path fill="var(--color-sky)" d="M778.5 657C801.6 643.5 816.7 621.7 821.8 595.7C826.6 571.2 825.2 546.6 818.5 522.7C811.5 498.1 792.3 474 768 464.9C755.9 459.9 743.4 456.2 730 456.1L660.3 455.9L660.4 376.8L717 376.6C730.8 376.8 743.3 373.8 756.2 369.1C776.6 360.7 791.5 343.6 797.2 322.2C805 293.5 802.9 252.4 780.9 233.1C767.3 221.1 749.1 215.5 731 215.5L643.8 215.3L643.8 248.7L531.7 248.7L531.7 139.3L739.9 139.4C765.1 139.4 789.1 145 812.1 153.8C843 165.5 873.5 191.5 886.1 221.8C900.1 255.5 902.7 293.1 891.9 328C883.1 356.6 863.6 378.8 838.9 394.9L810.7 410.8C833.7 421.3 855.1 432.8 874 449C890.7 463.3 902.8 481.2 911.4 501.5C927.2 538.6 928.8 579.3 920.4 618.5C904.6 692.8 844.2 732.4 772.3 744.2C753.1 747 734.9 747.6 715.6 747.4L660.8 747.5L660.8 669.4L733.9 668.9C749.7 668.8 764 663.8 778.5 657" />
					</svg>
				</div>
				<div style={at(`rotateY(180deg) translateZ(${D / 2}px)`, W, H, { ...FACE, filter: 'brightness(0.7)' })} />
				<div style={at(`rotateY(90deg) translateZ(${W / 2}px)`, D, H, { ...FACE, filter: 'brightness(0.82)' })} />
				<div style={at(`rotateY(-90deg) translateZ(${W / 2}px)`, D, H, { ...FACE, filter: 'brightness(0.82)' })} />
				<div
					style={at(`rotateX(90deg) translateZ(${H / 2}px)`, W, D, {
						backfaceVisibility: 'hidden',
						background: 'repeating-linear-gradient(90deg, var(--color-limestone) 0 2px, #efebe4 2px 3px)',
					})}
				/>
				<div style={at(`rotateX(-90deg) translateZ(${H / 2}px)`, W, D, { backfaceVisibility: 'hidden', background: 'var(--color-ink-deep)' })} />

				{/* Lens: a dark barrel, a ribbed focus ring, then the glass with the sky blue of the B in it */}
				<Discs
					x={6}
					y={22}
					z={D / 2 + 1}
					r={44}
					length={48}
					axis="z"
					paint={(i, last) => (last ? 'var(--color-line)' : i > 14 && i < 30 ? (i % 2 ? 'var(--color-ink)' : 'var(--color-slate)') : i > 40 ? 'var(--color-limestone)' : 'var(--color-ink-deep)')}
				/>
				<div
					style={at(`translate3d(6px, 22px, ${D / 2 + 50}px)`, 72, 72, {
						borderRadius: '50%',
						background:
							'radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.75) 0 3px, transparent 5px), radial-gradient(circle at 62% 66%, rgb(109 176 217 / 0.5) 0 2px, transparent 4px), radial-gradient(circle, var(--color-ink-deep) 0 30%, var(--color-sky) 31% 36%, var(--color-ink-deep) 37% 58%, var(--color-accent-deep) 59% 63%, var(--color-ink) 64% 100%)',
					})}
				/>

				{/* Shutter speed dial, and the release in tangerine */}
				<Discs x={-78} y={-H / 2} z={0} r={18} length={9} axis="y" paint={(_, last) => (last ? 'repeating-conic-gradient(var(--color-limestone) 0 6deg, var(--color-line) 6deg 12deg)' : 'var(--color-line)')} />
				<Discs x={74} y={-H / 2} z={4} r={12} length={4} axis="y" paint={() => 'var(--color-line)'} />
				<div ref={release} style={{ position: 'absolute', transformStyle: 'preserve-3d', transition: 'translate 120ms' }}>
					<Discs x={74} y={-H / 2 - 4} z={4} r={7} length={5} axis="y" paint={(_, last) => (last ? 'var(--color-tangerine)' : 'var(--color-ochre)')} />
				</div>
			</div>
		</div>
	);
}
