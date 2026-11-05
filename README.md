# sanadkw.com (Astro)

## التشغيل
1. `cp .env.example .env` وعبّئ المفاتيح (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_GA_ID).
2. نفّذ `supabase-security.sql` في Supabase ثم رقِّ حسابك: `UPDATE profiles SET is_admin = true WHERE id = '<UUID>';`
3. `npm install && npm run build`
4. ارفع **محتويات** مجلد `dist/` إلى `public_html` في GoDaddy (بما فيها `.htaccess`).

## ملفات يجب إضافتها في public/ قبل البناء
- `og-image.jpg` (1200x630) و `logo.png` (512x512).

## ملاحظات
- الموقع ثابت: أي مقال/صورة جديدة من /admin/ تظهر بعد إعادة `npm run build` والرفع.
- أضف روابط حساباتك في `SITE.sameAs` داخل `src/lib/site.js`، وعنوانك الفعلي إن وُجد في `seo.js`.
- استبدل صور Unsplash في `BeforeAfter.jsx` بصور أعمالك.

## حساب لوحة التحكم
الدخول إلى /admin/ يتم بالبريد الإلكتروني وكلمة المرور عبر Supabase Auth.
أنشئ الحساب من Authentication > Users، ثم نفّذ `create-admin.sql` لمنحه صلاحية الأدمن.
