
-- Fix overly permissive UPDATE on members
DROP POLICY "Auth users can update members" ON public.members;
CREATE POLICY "Auth users can update own members" ON public.members FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Fix overly permissive UPDATE on contributions
DROP POLICY "Auth users can update contributions" ON public.contributions;
CREATE POLICY "Auth users can update own contributions" ON public.contributions FOR UPDATE TO authenticated USING (auth.uid() = recorded_by);
