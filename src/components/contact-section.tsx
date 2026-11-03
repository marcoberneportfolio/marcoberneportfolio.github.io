import { useState, type FormEvent, type ReactNode } from 'react';
import CvLink from '@/components/ui/cv-link';
import SectionHead from '@/components/ui/section-head';
import { COPY, CV, SITE } from '@/data/site';

/**
 * Optional form backend (Formspree, Basin, your own API…). While it is empty,
 * submitting opens the visitor's mail app with the request pre-filled.
 */
const FORM_ENDPOINT = '';

const EXTRA = COPY.contact.extraField;

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

const inputClass =
	'mt-2 w-full border-b border-paper/30 bg-transparent py-3 text-base text-paper outline-none transition-colors placeholder:text-paper/60 focus:border-paper';

function Field({ label, htmlFor, children, error }: { label: string; htmlFor: string; children: ReactNode; error?: string }) {
	return (
		<div>
			<label htmlFor={htmlFor} className="text-sm text-accent-soft">
				{label}
			</label>
			{children}
			{error && (
				<p className="mt-2 text-sm text-paper" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}

function Choice({ name, options }: { name: string; options: string[] }) {
	return (
		<select id={name} name={name} defaultValue="" className={inputClass}>
			<option value="" className="text-ink">
				Choisir…
			</option>
			{options.map((option) => (
				<option key={option} value={option} className="text-ink">
					{option}
				</option>
			))}
		</select>
	);
}

export default function ContactSection() {
	const [status, setStatus] = useState<Status>('idle');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [copied, setCopied] = useState(false);

	const copyEmail = async () => {
		await navigator.clipboard.writeText(SITE.email);
		setCopied(true);
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const name = String(form.get('name') || '').trim();
		const email = String(form.get('email') || '').trim();
		const message = String(form.get('message') || '').trim();
		const type = String(form.get('type') || '');
		const extra = String(form.get('extra') || '').trim();

		const nextErrors: Record<string, string> = {};
		if (!name) nextErrors.name = 'Indiquez votre nom.';
		if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Vérifiez votre adresse, par exemple nom@entreprise.fr.';
		if (message.length < 10) nextErrors.message = 'Décrivez votre besoin en quelques mots.';
		setErrors(nextErrors);
		const firstError = Object.keys(nextErrors)[0];
		if (firstError) {
			(event.currentTarget.elements.namedItem(firstError) as HTMLElement).focus();
			return;
		}

		if (FORM_ENDPOINT) {
			setStatus('sending');
			try {
				const res = await fetch(FORM_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
					body: JSON.stringify({ name, email, type, [EXTRA.label]: extra, message }),
				});
				setStatus(res.ok ? 'sent' : 'error');
			} catch {
				setStatus('error');
			}
			return;
		}

		const details = [type && `${COPY.contact.typeLabel} : ${type}`, extra && `${EXTRA.label} : ${extra}`].filter(Boolean).join('\n');
		const body = `${details ? `${details}\n\n` : ''}${message}\n\n${name} — ${email}`;
		window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
			`${COPY.contact.mailSubject}${type ? ` · ${type}` : ''} — ${name}`
		)}&body=${encodeURIComponent(body)}`;
		setStatus('mailto');
	};

	return (
		<section id="contact" className="grain grain-dark scroll-mt-[72px] bg-ink text-paper">
			<div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
				<div>
					<SectionHead inverted label={COPY.contact.label} title={COPY.contact.title} />
					<p className="mt-6 max-w-md text-base leading-relaxed text-paper/75">{COPY.contact.text}</p>
					<div className="mt-8 flex flex-col items-start gap-3">
						<a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center border-b border-paper/30 text-base break-all hover:border-paper md:min-h-0 md:pb-1">
							{SITE.email}
						</a>
						{SITE.phone && (
							<a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center border-b border-paper/30 text-base hover:border-paper md:min-h-0 md:pb-1">
								{SITE.phone}
							</a>
						)}
					</div>
					<CvLink className="mt-8 bg-paper text-ink hover:bg-accent-soft">{CV.download}</CvLink>
				</div>

				<form onSubmit={onSubmit} noValidate className="grid gap-7 sm:grid-cols-2">
					<Field label="Nom" htmlFor="name" error={errors.name}>
						<input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} className={inputClass} />
					</Field>
					<Field label="E-mail" htmlFor="email" error={errors.email}>
						<input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputClass} />
					</Field>
					<Field label={`${COPY.contact.typeLabel} (facultatif)`} htmlFor="type">
						<Choice name="type" options={COPY.contact.sessionTypes} />
					</Field>
					<Field label={`${EXTRA.label} (facultatif)`} htmlFor="extra">
						{EXTRA.kind === 'select' && <Choice name="extra" options={EXTRA.options} />}
						{EXTRA.kind === 'date' && <input id="extra" name="extra" type="date" className={inputClass} />}
						{EXTRA.kind === 'text' && <input id="extra" name="extra" placeholder={EXTRA.placeholder} className={inputClass} />}
					</Field>
					<div className="sm:col-span-2">
						<Field label={COPY.contact.messageLabel} htmlFor="message" error={errors.message}>
							<textarea id="message" name="message" rows={4} placeholder={COPY.contact.messagePlaceholder} aria-invalid={!!errors.message} className={`${inputClass} resize-y`} />
						</Field>
					</div>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
						<button
							type="submit"
							disabled={status === 'sending'}
							className="cursor-pointer bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-accent-soft disabled:opacity-60"
						>
							{status === 'sending' ? 'Envoi…' : COPY.contact.submit}
						</button>
						<p className="text-sm text-paper/70" role="status">
							{status === 'sent' && 'Message envoyé, merci.'}
							{status === 'error' && 'L’envoi a échoué : écrivez-moi directement par e-mail.'}
							{status === 'mailto' && `Votre messagerie devrait s’ouvrir. Si rien ne se passe, votre message reste ici : envoyez-le à ${SITE.email}.`}
							{(status === 'idle' || status === 'sending') && COPY.contact.responseTime}
						</p>
						{status === 'mailto' && (
							<button type="button" onClick={copyEmail} className="min-h-11 cursor-pointer border-b border-paper/30 text-sm font-medium hover:border-paper md:min-h-0 md:pb-1">
								{copied ? 'Adresse copiée' : 'Copier l’adresse'}
							</button>
						)}
					</div>
				</form>
			</div>
		</section>
	);
}
