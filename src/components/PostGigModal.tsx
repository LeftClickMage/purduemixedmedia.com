import { useState } from 'react';
import Button from './Button';

interface PostGigModalProps {
  onClose: () => void;
  onPosted: () => void;
}

function nowForDatetimeLocal(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function PostGigModal({ onClose, onPosted }: PostGigModalProps) {
  const [posterName, setPosterName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(nowForDatetimeLocal);
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/auth/post-gig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          posterName,
          description,
          location,
          startTime: new Date(startTime).toISOString(),
          price: `$${price}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data.detail ? ` — ${typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)}` : '';
        throw new Error(`${data.message ?? `Request failed (${res.status})`}${detail}`);
      }
      onPosted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post gig');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Post a Gig</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Your Name</span>
            <input
              type="text"
              required
              value={posterName}
              onChange={e => setPosterName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
              maxLength={80}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">What you need</span>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-24 resize-none overflow-y-auto"
              maxLength={800}
              placeholder="Describe what you're looking for…"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Location</span>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
              maxLength={100}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Date and Time</span>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Price</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
              <input
                type="number"
                required
                min="0"
                step="any"
                inputMode="decimal"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="200"
                className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2"
              />
            </div>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between gap-2 mt-2">
            <Button text="Cancel" onClick={onClose}/>
            <Button text={submitting ? 'Posting…' : 'Post Gig'} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostGigModal;
