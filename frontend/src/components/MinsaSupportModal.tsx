import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, ShieldCheck, Heart, AlertTriangle, ExternalLink, Building2, UserCheck, FileCheck, MapPin } from 'lucide-react';
import { db, type Profile, type MaternalHouse } from '../db/db';
import { useTranslation } from '../i18n/useTranslation';
import { calculateDistanceKm, formatDistance, NICARAGUA_DEPARTMENTS } from '../services/locationService';

interface MinsaSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;
}

export default function MinsaSupportModal({ isOpen, onClose, profile }: MinsaSupportModalProps) {
  const { t } = useTranslation(profile);
  const [nearbyFacilities, setNearbyFacilities] = useState<(MaternalHouse & { distanceKm: number })[]>([]);

  useEffect(() => {
    async function loadFacilities() {
      const data = await db.maternalHouses.toArray();
      const userLat = profile?.latitude || NICARAGUA_DEPARTMENTS.find(d => d.name === (profile?.department || 'Managua'))?.capitalCoords.latitude || 12.1364;
      const userLng = profile?.longitude || NICARAGUA_DEPARTMENTS.find(d => d.name === (profile?.department || 'Managua'))?.capitalCoords.longitude || -86.2514;
      
      const mapped = data.map(h => ({
        ...h,
        distanceKm: calculateDistanceKm(userLat, userLng, h.latitude, h.longitude)
      })).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);

      setNearbyFacilities(mapped);
    }
    if (isOpen) {
      loadFacilities();
    }
  }, [isOpen, profile]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overscroll-contain">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{t.supportDirectory.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{t.supportDirectory.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 flex items-start space-x-3">
            <Heart className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-950 leading-relaxed font-medium">
              {t.supportDirectory.bannerText}
            </p>
          </div>

          {/* Emergency Lines Grid */}
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Líneas de Atención Inmediata
            </span>

            {/* Line 1: 118 Policia & Comisarias */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-xs">118</span>
                  <h4 className="text-xs font-bold text-slate-900">{t.supportDirectory.policeLine}</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  {t.supportDirectory.policeDesc}
                </p>
              </div>
              <a
                href="tel:118"
                className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-sm hover:bg-rose-700 transition-all flex items-center space-x-1.5 shrink-0 ml-3 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.supportDirectory.callAction}</span>
              </a>
            </div>

            {/* Line 2: 102 MINSA Ambulancias */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-xs">102</span>
                  <h4 className="text-xs font-bold text-slate-900">{t.supportDirectory.ambulanceLine}</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  {t.supportDirectory.ambulanceDesc}
                </p>
              </div>
              <a
                href="tel:102"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm hover:bg-emerald-700 transition-all flex items-center space-x-1.5 shrink-0 ml-3 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.supportDirectory.callAction}</span>
              </a>
            </div>

            {/* Line 3: 133 MIFAMILIA */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-black text-xs">133</span>
                  <h4 className="text-xs font-bold text-slate-900">{t.supportDirectory.familyLine}</h4>
                </div>
                <p className="text-[11px] text-slate-600">
                  {t.supportDirectory.familyDesc}
                </p>
              </div>
              <a
                href="tel:133"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-sm hover:bg-indigo-700 transition-all flex items-center space-x-1.5 shrink-0 ml-3 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.supportDirectory.callAction}</span>
              </a>
            </div>
          </div>

          {/* Nearby Health Facilities (Georreferenciados MINSA) */}
          {nearbyFacilities.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Establecimientos de Salud Cercanos (MINSA)
                </span>
                <span className="text-[10px] font-bold text-rose-600">
                  {profile?.department ? `Ubicación: ${profile.department}` : 'Nacional'}
                </span>
              </div>

              <div className="space-y-2">
                {nearbyFacilities.map(facility => (
                  <div key={facility.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{facility.type === 'hospital' ? '🏥' : '🏡'}</span>
                        <h5 className="text-xs font-bold text-slate-900">{facility.name}</h5>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 text-rose-500 mr-1 inline shrink-0" />
                        {facility.municipality}, {facility.department} • <strong>{formatDistance(facility.distanceKm)}</strong>
                      </span>
                      {facility.hasObstetricSurgery && (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-extrabold">
                          ✂️ Quirófano / Cesárea 24h
                        </span>
                      )}
                    </div>

                    {facility.phone && (
                      <a
                        href={`tel:${facility.phone}`}
                        className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 transition-all shrink-0 ml-2 cursor-pointer"
                        title="Llamar"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Platforms and Protocols */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Canales Digitales e Institucionales
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mi Denuncia Web */}
              <a
                href="https://www.policia.gob.ni"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Trámites Policiales y Denuncias
                  </h5>
                  <p className="text-[10px] text-slate-500">policia.gob.ni</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
              </a>

              {/* Portal MINSA */}
              <a
                href="http://www.minsa.gob.ni"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Portal Informativo MINSA
                  </h5>
                  <p className="text-[10px] text-slate-500">minsa.gob.ni</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </a>
            </div>
          </div>

          {/* Legal Framework & Privacy Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <FileCheck className="w-4 h-4 text-rose-500" />
              <span>Marco Legal y Resguardo de Privacidad:</span>
            </div>
            <p className="leading-relaxed">
              En Nicaragua, la Ley 779 (Ley Integral Contra la Violencia Hacia las Mujeres) y el Código de la Niñez y la Adolescencia garantizan atención prioritaria, digna y confidencial.
            </p>
            <p className="leading-relaxed font-semibold text-rose-700">
              🔒 Blooma no almacena ni comparte tus consultas de auxilio en servidores externos. Tu privacidad es sagrada.
            </p>
          </div>

        </div>

        {/* Footer Close Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.nav.close}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
