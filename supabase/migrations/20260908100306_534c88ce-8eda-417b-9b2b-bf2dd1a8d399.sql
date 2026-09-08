CREATE TABLE public.action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  area resource_area NOT NULL DEFAULT 'general'::resource_area,
  model text NOT NULL DEFAULT '',
  goal text NOT NULL DEFAULT '',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.action_plans TO authenticated;
GRANT ALL ON public.action_plans TO service_role;

ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own action plans"
ON public.action_plans FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE TRIGGER action_plans_set_updated_at
BEFORE UPDATE ON public.action_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();