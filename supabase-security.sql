-- نفّذه في Supabase > SQL Editor. يحذف كل السياسات القديمة ثم ينشئ سياسات آمنة.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('profiles','articles','gallery_projects','service_pricing')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin) VALUES (NEW.id, false) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- دالة مساعدة للتحقق من الأدمن (تتجاوز RLS داخلياً فلا تحدث حلقة)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- لا توجد سياسات INSERT/UPDATE/DELETE على profiles عمداً. الترقية يدوياً فقط:
-- UPDATE public.profiles SET is_admin = true WHERE id = '<USER_UUID>';

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admin insert articles" ON public.articles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update articles" ON public.articles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete articles" ON public.articles FOR DELETE USING (public.is_admin());

ALTER TABLE public.gallery_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_projects FOR SELECT USING (true);
CREATE POLICY "Admin insert gallery" ON public.gallery_projects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update gallery" ON public.gallery_projects FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete gallery" ON public.gallery_projects FOR DELETE USING (public.is_admin());

ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pricing" ON public.service_pricing FOR SELECT USING (true);
CREATE POLICY "Admin update pricing" ON public.service_pricing FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
