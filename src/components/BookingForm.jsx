import React, { useEffect, useRef, useState } from 'react';

const AREAS = ['حولي', 'العاصمة', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير'];
const PHONE_RE = /^(?:\+?965)?[569]\d{7}$/;

export default function BookingForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('حولي');
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'يرجى إدخال الاسم الكريم';
    if (!PHONE_RE.test(phone.replace(/\s+/g, ''))) errs.phone = 'رقم الهاتف غير صحيح (8 أرقام يبدأ بـ 5 أو 6 أو 9)';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    window.gtag?.('event', 'generate_lead', { event_category: 'Booking', event_label: area });
    const msg = `طلب معاينة جديد:\n- الاسم: ${name.trim()}\n- الهاتف: ${phone.trim()}\n- المنطقة: ${area}`;
    window.open(`https://wa.me/96565587628?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 6000);
    setName(''); setPhone('');
  };

  const field = 'w-full bg-slate-800 border rounded p-2.5 text-xs text-white';
  return (
    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-amber-400">اطلب معاينة مجانية الآن</h2>
        <p className="text-slate-300 text-xs">املأ البيانات وسنتواصل معك فوراً لتأكيد الموعد في أي منطقة بالكويت.</p>
      </div>
      {done && <div className="bg-emerald-800 text-white p-3 rounded text-center text-xs" role="status">تم تجهيز طلبك في واتساب، أرسله لنرد عليك خلال دقائق.</div>}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bk-name" className="block text-xs mb-1">الاسم الكريم:</label>
            <input id="bk-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: بو فهد"
              className={`${field} ${errors.name ? 'border-rose-500' : 'border-slate-700'}`} />
            {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="bk-phone" className="block text-xs mb-1">رقم الهاتف الكويتي:</label>
            <input id="bk-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="965xxxxxxxx"
              className={`${field} ${errors.phone ? 'border-rose-500' : 'border-slate-700'}`} />
            {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="bk-area" className="block text-xs mb-1">المنطقة:</label>
          <select id="bk-area" value={area} onChange={(e) => setArea(e.target.value)} className={`${field} border-slate-700`}>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition">
          إرسال طلب المعاينة عبر واتساب
        </button>
      </form>
    </div>
  );
}
