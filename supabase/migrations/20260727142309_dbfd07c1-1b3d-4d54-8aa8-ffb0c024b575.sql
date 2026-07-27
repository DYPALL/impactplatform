
CREATE TYPE public.resource_type AS ENUM ('publication', 'video', 'template', 'session_outline', 'document');
CREATE TYPE public.resource_area AS ENUM ('representativeness', 'governance', 'empowerment', 'results', 'general');

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  url text,
  resource_type public.resource_type NOT NULL,
  area public.resource_area NOT NULL DEFAULT 'general',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (published = true);

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.resources (title, description, resource_type, area) VALUES
('Youth Participation Handbook', 'A practical guide to setting up inclusive Local Youth Councils and ensuring diverse voices are represented in decision-making.', 'publication', 'representativeness'),
('Transparent Governance in 5 Steps', 'Video walkthrough on establishing transparent decision-making processes within your Local Youth Council.', 'video', 'governance'),
('Meeting Minutes Template', 'Ready-to-use template for documenting Local Youth Council meetings, decisions, and action items.', 'template', 'governance'),
('Empowering Young Leaders', 'A collection of case studies showing how councils across Europe have empowered members through training and resources.', 'publication', 'empowerment'),
('Measuring Impact Workshop', 'Full session outline for a two-hour workshop on defining and tracking the impact of youth council initiatives.', 'session_outline', 'results'),
('Annual Report Template', 'Editable document to help councils report their yearly achievements, challenges, and outcomes to stakeholders.', 'document', 'results');
