import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const inp = 'w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white';

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [articles, setArticles] = useState([]);
  const [images, setImages] = useState([]);
  const [a, setA] = useState({ title: '', slug: '', snippet: '', content: '' });
  const [g, setG] = useState({ title: '', image_url: '', alt_text: '' });

  const loadLists = useCallback(async () => {
    const [ar, im] = await Promise.all([
      supabase.from('articles').select('id,title,slug').order('created_at', { ascending: false }),
      supabase.from('gallery_projects').select('id,title,image_url').order('created_at', { ascending: false }),
    ]);
    setArticles(ar.data || []);
    setImages(im.data || []);
  }, []);

  const checkAdmin = useCallback(async (user) => {
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    const ok = !!data?.is_admin;
    setIsAdmin(ok);
    if (ok) loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) checkAdmin(data.session.user).finally(() => setReady(true));
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) checkAdmin(s.user); else setIsAdmin(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [checkAdmin]);

  const login = async (e) => {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
  };
  const logout = async () => { await supabase.auth.signOut(); setIsAdmin(false); setSession(null); };

  const addArticle = async (e) => {
    e.preventDefault();
    if (!a.title || !a.slug || !a.content) return setMsg('العنوان والرابط والمحتوى مطلوبة.');
    const { error } = await supabase.from('articles').insert([{
      title: a.title.trim(), slug: a.slug.trim().toLowerCase(),
      snippet: a.snippet || a.content.substring(0, 90) + '...', content: a.content,
    }]);
    if (error) return setMsg(error.message);
    setA({ title: '', slug: '', snippet: '', content: '' });
    setMsg('تم نشر المقال. أعد بناء الموقع (Build) ليظهر للزوار.');
    loadLists();
  };
  const delArticle = async (id) => {
    if (!window.confirm('حذف هذا المقال؟')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) setMsg(error.message); else loadLists();
  };
  const addImage = async (e) => {
    e.preventDefault();
    if (!g.title || !g.image_url) return setMsg('العنوان ورابط الصورة مطلوبان.');
    const { error } = await supabase.from('gallery_projects').insert([{ title: g.title, image_url: g.image_url, alt_text: g.alt_text || g.title }]);
    if (error) return setMsg(error.message);
    setG({ title: '', image_url: '', alt_text: '' });
    setMsg('تمت إضافة الصورة. أعد بناء الموقع ليظهر للزوار.');
    loadLists();
  };
  const delImage = async (id) => {
    if (!window.confirm('حذف هذه الصورة؟')) return;
    const { error } = await supabase.from('gallery_projects').delete().eq('id', id);
    if (error) setMsg(error.message); else loadLists();
  };

  if (!supabase) return <div className="p-6 text-center text-sm">إعدادات Supabase غير متوفرة.</div>;
  if (!ready) return <div className="p-6 text-center text-sm">جارٍ التحميل...</div>;

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-slate-900 text-white rounded-2xl border border-amber-500/40">
      {msg && <div className="bg-slate-800 text-amber-300 p-3 rounded text-xs mb-4" role="status">{msg}</div>}
      {!session ? (
        <form onSubmit={login} className="space-y-4 max-w-sm mx-auto py-4">
          <h1 className="text-xl font-bold text-amber-400 text-center">تسجيل دخول المسؤول</h1>
          <input type="email" required placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
          <input type="password" required placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className={inp} />
          <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs">دخول</button>
        </form>
      ) : !isAdmin ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-sm">الحساب مسجل الدخول لكن ليس لديه صلاحيات مسؤول.</p>
          <button onClick={logout} className="bg-rose-600 px-4 py-2 rounded text-xs font-bold">تسجيل الخروج</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h1 className="text-lg font-bold text-amber-400">لوحة التحكم</h1>
            <button onClick={logout} className="text-rose-400 text-xs font-bold hover:underline">خروج</button>
          </div>

          <form onSubmit={addArticle} className="bg-slate-800 p-4 rounded-xl space-y-2">
            <h2 className="font-bold text-amber-300 text-xs">نشر مقال جديد</h2>
            <input className={inp} placeholder="عنوان المقال" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
            <input className={inp} placeholder="الرابط (slug) مثل: kuwait-painting-guide" value={a.slug} onChange={(e) => setA({ ...a, slug: e.target.value })} />
            <input className={inp} placeholder="مقتطف قصير" value={a.snippet} onChange={(e) => setA({ ...a, snippet: e.target.value })} />
            <textarea className={`${inp} h-28`} placeholder="المحتوى الكامل (فقرة جديدة = سطر فاضي)" value={a.content} onChange={(e) => setA({ ...a, content: e.target.value })} />
            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-1.5 rounded text-xs">نشر المقال</button>
          </form>

          <ul className="space-y-2">
            {articles.map((x) => (
              <li key={x.id} className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs">
                <span>{x.title}</span>
                <button onClick={() => delArticle(x.id)} className="text-rose-400 font-bold">حذف</button>
              </li>
            ))}
          </ul>

          <form onSubmit={addImage} className="bg-slate-800 p-4 rounded-xl space-y-2">
            <h2 className="font-bold text-amber-300 text-xs">إضافة صورة لمعرض الأعمال</h2>
            <input className={inp} placeholder="عنوان المشروع" value={g.title} onChange={(e) => setG({ ...g, title: e.target.value })} />
            <input className={inp} placeholder="رابط الصورة (URL)" value={g.image_url} onChange={(e) => setG({ ...g, image_url: e.target.value })} />
            <input className={inp} placeholder="نص Alt وصفي بالعربية" value={g.alt_text} onChange={(e) => setG({ ...g, alt_text: e.target.value })} />
            <button type="submit" className="w-full bg-emerald-600 font-bold py-1.5 rounded text-xs">حفظ الصورة</button>
          </form>

          <ul className="space-y-2">
            {images.map((x) => (
              <li key={x.id} className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs">
                <span>{x.title}</span>
                <button onClick={() => delImage(x.id)} className="text-rose-400 font-bold">حذف</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
