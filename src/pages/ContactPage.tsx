import Subtitle from '../components/Subtitle';
import FormSection from '../components/FormSection';
import FormInput from '../components/FormInput';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';

const RECIPIENTS = [
  { label: 'General Questions', email: 'officers@purduemixedmedia.com' },
  { label: 'Request Equipment', email: 'inventory@purduemixedmedia.com' },
  { label: 'Business Inquiries', email: 'business@purduemixedmedia.com' },
];
const DEFAULT_RECIPIENT = 'General Questions';

function ContactPage() {
  usePageTitle(pageMeta.contact.title);
  usePageDescription(pageMeta.contact.description);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const recipientLabel = (form.elements.namedItem('recipient') as HTMLSelectElement).value;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value;

    const recipientEmail = RECIPIENTS.find(r => r.label === recipientLabel)?.email ?? '';
    const lines = [
      name && `From: ${name}`,
      email && `Reply-to: ${email}`,
      '',
      body,
    ].filter(l => l !== undefined).join('\n');
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
      <Subtitle text="Contact" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <FormSection text="Name">
          <FormInput name="name" type="text" />
        </FormSection>
        <FormSection text="Your email">
          <FormInput name="email" type="email" />
        </FormSection>
        <FormSection text="Contact">
          <FormInput as="select" name="recipient" defaultValue={DEFAULT_RECIPIENT}>
            {RECIPIENTS.map(r => (
              <option key={r.label} value={r.label}>{r.label}</option>
            ))}
          </FormInput>
        </FormSection>
        <FormSection text="Subject">
          <FormInput name="subject" type="text" required />
        </FormSection>
        <FormSection text="Message">
          <FormInput as="textarea" name="body" rows={6} required />
        </FormSection>
        <button
          type="submit"
          className="self-end bg-black text-white font-medium px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ContactPage;
