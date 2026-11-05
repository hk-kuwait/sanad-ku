import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_RATES = { paint: 2.5, decor: 6.0, all: 9.5 };
const NAMES = { paint: 'أصباغ دهانات منزلية', decor: 'بديل خشب ورخام وديكور', all: 'تشطيب متكامل' };
const clamp = (v) => Math.max(10, Math.min(2000, Number(v) || 10));

export default function Calculator() {
  const [area, setArea] = useState(60);
  const [type, setType] = useState('paint');
  const [rates, setRates] = useState(DEFAULT_RATES);
  const tracked = useRef(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('service_pricing')
      .select('*')
      .then(({ data, error }) => {
        if (error || !data || !data.length) return;
        const map = {};
        data.forEach((p) => { if (p.id in DEFAULT_RATES && p.rate_per_sqm) map[p.id] = Number(p.rate_per_sqm); });
        setRates((prev) => ({ ...prev, ...map }));
      });
  }, []);

  const valid = clamp(area);
  const price = Math.round(valid * (rates[type] || 2.5) * 100) / 100;

  const send = () => {
    window.gtag?.('event', 'use_calculator', { area: valid, service_type: type, estimated_price: price });
    const msg = `السلام عليكم، أرغب بالاستفسار عن معاينة لمشروع:\n- المساحة: ${valid} م²\n- الخدمة: ${NAMES[type]}\n- التكلفة التقديرية: ${price} د.ك\nيرجى التواصل لتحديد الموعد.`;
    window.open(`https://wa.me/96565587628?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900">حاسبة تكلفة الأصباغ والديكور بالمتر المربع</h2>
        <p className="text-xs text-slate-500">اختر المساحة ونوع الخدمة لحساب التكلفة التقديرية وإرسالها عبر الواتساب.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="calc-area" className="block text-xs font-semibold mb-2">المساحة الإجمالية للجدران (م²):</label>
          <input id="calc-area" type="number" min="10" max="2000" value={area}
            onChange={(e) => setArea(e.target.value)} onBlur={() => setArea(clamp(area))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 mb-2" />
          <input type="range" min="10" max="500" step="10" value={Math.min(valid, 500)}
            onChange={(e) => setArea(parseInt(e.target.value, 10))} className="w-full accent-amber-500" aria-label="تعديل المساحة" />
        </div>
        <div>
          <label htmlFor="calc-type" className="block text-xs font-semibold mb-2">نوع الخدمة المطلوبة:</label>
          <select id="calc-type" value={type} onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs">
            <option value="paint">أصباغ دهانات منزلية (أساسي)</option>
            <option value="decor">بديل خشب ورخام وديكور</option>
            <option value="all">تشطيب متكامل (أصباغ وديكور شامل)</option>
          </select>
        </div>
      </div>
      <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-200 space-y-2" aria-live="polite">
        <span className="text-xs text-slate-600 block">التكلفة التقديرية الإجمالية:</span>
        <span className="text-2xl font-extrabold text-amber-700">{price} دينار كويتي تقريباً</span>
        <span className="text-[11px] text-slate-500 block">* السعر تقديري ويثبّت بعد المعاينة المجانية في موقعك.</span>
      </div>
      <button type="button" onClick={send}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow text-sm transition">
        إرسال نتيجة الحاسبة إلى واتساب الشركة
      </button>
    </div>
  );
}
