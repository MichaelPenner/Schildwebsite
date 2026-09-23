import { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { formatPrice } from '../../utils/formatting';
import { Check, X, Plus } from 'lucide-react';
import type { ProductColor } from '../../types';

export default function AdminMaterials() {
  const { materials, colors, toggleMaterial, toggleColor, addColor } = useAdminStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColor, setNewColor] = useState({
    name: '', hex: '#000000', materialId: 'mat-pla',
    finish: 'matt', glossLevel: 20, priceModifier: 0
  });

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.name) return;
    const color: ProductColor = {
      id: `col-${Date.now()}`,
      name: newColor.name,
      materialId: newColor.materialId,
      hex: newColor.hex,
      finish: newColor.finish as any,
      glossLevel: newColor.glossLevel,
      priceModifier: newColor.priceModifier,
      isActive: true,
      inStock: true
    };
    addColor(color);
    setNewColor({ name: '', hex: '#000000', materialId: 'mat-pla', finish: 'matt', glossLevel: 20, priceModifier: 0 });
    setShowAddForm(false);
  };

  return (
    <div className="admin-page">
      <h1 className="heading-2">Materialien & Farben</h1>
      <p className="text-secondary admin-page__subtitle">Verfügbare Materialien und Farben verwalten</p>

      {/* Materials */}
      <section className="admin-section">
        <h3 className="heading-3">Materialien</h3>
        <div className="admin-cards">
          {materials.map((mat) => (
            <div key={mat.id} className={`admin-material-card glass-card-static ${!mat.isActive ? 'admin-material-card--inactive' : ''}`}>
              <div className="admin-material-card__header">
                <h4>{mat.name}</h4>
                <button
                  className={`btn btn-sm ${mat.isActive ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => toggleMaterial(mat.id)}
                >
                  {mat.isActive ? <><Check size={14} /> Aktiv</> : <><X size={14} /> Inaktiv</>}
                </button>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{mat.description}</p>
              {mat.priceModifier > 0 && (
                <p className="text-accent" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  +{formatPrice(mat.priceModifier)}
                </p>
              )}
              {mat.properties && (
                <div className="admin-material-card__props">
                  {Object.entries(mat.properties).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-secondary">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="heading-3">Farben</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Farbe hinzufügen
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddColor} className="glass-card-static" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>Neue Farbe anlegen</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>Name</label>
                <input type="text" className="glass-input" value={newColor.name} onChange={e => setNewColor({...newColor, name: e.target.value})} placeholder="z.B. Neon Pink" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>HEX Code</label>
                <input type="color" className="glass-input" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} style={{ padding: '4px', height: '44px', width: '100%', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>Material</label>
                <select className="glass-input" value={newColor.materialId} onChange={e => setNewColor({...newColor, materialId: e.target.value})} style={{ backgroundColor: '#10122a' }}>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>Finish</label>
                <select className="glass-input" value={newColor.finish} onChange={e => setNewColor({...newColor, finish: e.target.value})} style={{ backgroundColor: '#10122a' }}>
                  <option value="matt">Matt</option>
                  <option value="satin">Satin</option>
                  <option value="gloss">Glänzend</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>Glanzgrad (0-100)</label>
                <input type="number" className="glass-input" value={newColor.glossLevel} onChange={e => setNewColor({...newColor, glossLevel: Number(e.target.value)})} min="0" max="100" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="text-secondary" style={{ fontSize: '0.875rem' }}>Aufpreis (Cent, z.B. 150 = 1,50€)</label>
                <input type="number" className="glass-input" value={newColor.priceModifier} onChange={e => setNewColor({...newColor, priceModifier: Number(e.target.value)})} min="0" step="50" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>Farbe speichern</button>
            </div>
          </form>
        )}

        <div className="admin-table-wrap glass-card-static">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Farbe</th>
                <th>Name</th>
                <th>Material</th>
                <th>Finish</th>
                <th>Glanz</th>
                <th>Aufschlag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => {
                const mat = materials.find((m) => m.id === color.materialId);
                return (
                  <tr key={color.id} className={!color.isActive ? 'admin-table__row--inactive' : ''}>
                    <td>
                      <div
                        className="admin-color-dot"
                        style={{ background: color.hex }}
                        title={color.hex}
                      />
                    </td>
                    <td>{color.name}</td>
                    <td>{mat?.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{color.finish}</td>
                    <td>{color.glossLevel}%</td>
                    <td>
                      {color.priceModifier > 0
                        ? `+${formatPrice(color.priceModifier)}`
                        : '—'}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${color.isActive ? 'btn-secondary' : 'btn-ghost'}`}
                        onClick={() => toggleColor(color.id)}
                      >
                        {color.isActive ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
