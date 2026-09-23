import { useAdminStore } from '../../stores/adminStore';
import { Check, X } from 'lucide-react';

export default function AdminFonts() {
  const { fonts, toggleFont } = useAdminStore();

  return (
    <div className="admin-page">
      <h1 className="heading-2">Schriftarten</h1>
      <p className="text-secondary admin-page__subtitle">Verfügbare Fonts verwalten</p>

      <div className="admin-table-wrap glass-card-static">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vorschau</th>
              <th>Name</th>
              <th>Kategorie</th>
              <th>CSS Family</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.id} className={!font.isActive ? 'admin-table__row--inactive' : ''}>
                <td>
                  <span style={{ fontFamily: font.cssFamily, fontSize: '1.1rem' }}>
                    AaBbCc 123
                  </span>
                </td>
                <td><strong>{font.displayName}</strong></td>
                <td style={{ textTransform: 'capitalize' }}>{font.category}</td>
                <td className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  {font.cssFamily}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${font.isActive ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => toggleFont(font.id)}
                  >
                    {font.isActive ? <><Check size={14} /> Aktiv</> : <><X size={14} /> Inaktiv</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
