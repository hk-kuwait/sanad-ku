import React, { useState } from 'react';

const AFTER = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=75&fm=webp';
const BEFORE = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=75&fm=webp';

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-2xl">
      <p className="text-amber-400 text-xs font-bold mb-2 text-center">مقارنة أعمال التشطيب (قبل وبعد)</p>
      <div className="relative h-72 rounded-xl overflow-hidden select-none">
        <img src={AFTER} alt="تنفيذ أصباغ حديثة وديكورات صالة منزل في الكويت بعد التشطيب" width="800" height="450"
          className="absolute inset-0 w-full h-full object-cover" fetchpriority="high" decoding="async" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={BEFORE} alt="غرفة قبل أعمال الصبغ والتشطيب في الكويت" width="800" height="450"
            className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} loading="lazy" decoding="async" />
        </div>
        <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30" aria-label="مقارنة الصور قبل وبعد" />
        <div className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 pointer-events-none" style={{ left: `${pos}%` }}></div>
      </div>
    </div>
  );
}
