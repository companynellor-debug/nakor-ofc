DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_user_app_state_updated_at ON public.user_app_state;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP TABLE IF EXISTS public.user_app_state;
DROP TABLE IF EXISTS public.profiles;