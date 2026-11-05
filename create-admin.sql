-- 1) أنشئ المستخدم أولاً من: Supabase > Authentication > Users > Add user
--    (اكتب بريدك وكلمة مرور قوية من اختيارك، وفعّل Auto Confirm User)
-- 2) ثم نفّذ هذا الأمر بعد تعديل البريد:
UPDATE public.profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'ضع-بريدك-هنا@example.com');
