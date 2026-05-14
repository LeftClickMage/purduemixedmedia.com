import { useEffect, useState } from 'react';
import OfficerCard, { type Officer } from '../components/OfficerCard';
import Subtitle from '../components/Subtitle';
import { usePageTitle } from '../lib/usePageTitle';
import { fetchSheet } from '../lib/sheets';

function OfficersPage() {
  usePageTitle('Officers');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSheet(import.meta.env.VITE_OFFICERS_SHEET_ID, 'A:F')
      .then(rows => {
        console.log(rows);
        setOfficers(rows.map(r => ({
          name: r["Name"],
          role: r["Role"],
          description: r["Description"],
          photo: r["Headshot"],
          portfolio: r["Portfolio"] || undefined,
          contact: r["Contact"] || undefined,
        })));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Subtitle text="Officers" />
      {loading && <p className="text-gray-500">Loading officers...</p>}
      {error && <p className="text-red-500">Could not load officers: {error}</p>}
      {!loading && !error && officers.length === 0 && (
        <p className="text-gray-500">No officers listed.</p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {officers.map((officer, i) => (
          officer.name && officer.description && officer.role && officer.photo && <OfficerCard key={i} officer={officer} />
        ))}
      </ul>
    </div>
  );
}

export default OfficersPage;
