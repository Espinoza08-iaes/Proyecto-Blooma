import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckSquare, Square, Plus, User, Baby, Users } from 'lucide-react';
import { db, type HospitalBagItem } from '../db/db';

const defaultItems: Omit<HospitalBagItem, 'id'>[] = [
  // Mom
  { category: 'mom', title: 'Documento de Identidad (Cédula / Carnet de Salud)', checked: true },
  { category: 'mom', title: 'Bata cómoda y 2 pijamas de lactancia', checked: false },
  { category: 'mom', title: 'Ropa interior cómoda de tiro alto (3-4 pares)', checked: false },
  { category: 'mom', title: 'Toallas sanitarias postparto de absorción máxima', checked: false },
  { category: 'mom', title: 'Artículos de aseo personal (cepillo, jabón, champú)', checked: false },
  // Baby
  { category: 'baby', title: '3 mudadas de ropa completas (gorro, mameluco, calcetines)', checked: false },
  { category: 'baby', title: 'Pañales para recién nacido (1 paquete)', checked: true },
  { category: 'baby', title: 'Manta o cobijita suave de algodón', checked: false },
  { category: 'baby', title: 'Toallitas húmedas hipoalergénicas', checked: false },
  // Partner
  { category: 'partner', title: 'Cargador de teléfono celular de cable largo', checked: false },
  { category: 'partner', title: 'Snacks ligeros y botellas de agua', checked: false },
  { category: 'partner', title: 'Muda de ropa cómoda de cambio', checked: false },
];

export default function HospitalBag() {
  const [activeCategory, setActiveCategory] = useState<'mom' | 'baby' | 'partner'>('mom');
  const [items, setItems] = useState<HospitalBagItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    initBag();
  }, []);

  const initBag = async () => {
    const existing = await db.hospitalBagItems.toArray();
    if (existing.length === 0) {
      await db.hospitalBagItems.bulkAdd(defaultItems as HospitalBagItem[]);
      const loaded = await db.hospitalBagItems.toArray();
      setItems(loaded);
    } else {
      setItems(existing);
    }
  };

  const handleToggle = async (id?: number, currentChecked?: boolean) => {
    if (!id) return;
    await db.hospitalBagItems.update(id, { checked: !currentChecked });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !currentChecked } : item))
    );
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: HospitalBagItem = {
      category: activeCategory,
      title: newItemTitle.trim(),
      checked: false,
    };

    const id = await db.hospitalBagItems.add(newItem);
    setItems((prev) => [...prev, { ...newItem, id }]);
    setNewItemTitle('');
  };

  const filteredItems = items.filter((item) => item.category === activeCategory);
  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="blooma-card p-5 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-brand-teal-50 text-brand-teal-700">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Maleta de Hospital (Checklist)</h4>
            <p className="text-xs text-brand-earth-500">Organizador para el día del parto</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-black text-brand-teal-700">{progressPercent}% Listo</div>
          <div className="text-[10px] text-brand-earth-500 font-semibold">{checkedCount} de {totalCount} empacados</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="w-full bg-brand-earth-100 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-brand-teal-600 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 mb-3">
        <button
          onClick={() => setActiveCategory('mom')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeCategory === 'mom'
              ? 'bg-brand-teal-600 text-white shadow-sm'
              : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Mamá</span>
        </button>
        <button
          onClick={() => setActiveCategory('baby')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeCategory === 'baby'
              ? 'bg-brand-teal-600 text-white shadow-sm'
              : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          <span>Bebé</span>
        </button>
        <button
          onClick={() => setActiveCategory('partner')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeCategory === 'partner'
              ? 'bg-brand-teal-600 text-white shadow-sm'
              : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Acompañante</span>
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id, item.checked)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 text-xs ${
              item.checked
                ? 'bg-brand-earth-50 border-brand-earth-150 text-brand-earth-400 line-through'
                : 'bg-white border-brand-earth-200 text-brand-earth-800 font-bold'
            }`}
          >
            {item.checked ? (
              <CheckSquare className="w-4 h-4 text-brand-teal-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-brand-earth-400 shrink-0" />
            )}
            <span className="flex-1">{item.title}</span>
          </div>
        ))}
      </div>

      {/* Add Custom Item Input */}
      <form onSubmit={handleAddItem} className="mt-3 flex space-x-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder={`Agregar artículo para ${activeCategory === 'mom' ? 'Mamá' : activeCategory === 'baby' ? 'Bebé' : 'Acompañante'}...`}
          className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-brand-earth-200 bg-white text-brand-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-300"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-brand-teal-600 text-white hover:bg-brand-teal-700 transition-all text-xs font-bold active-press"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
