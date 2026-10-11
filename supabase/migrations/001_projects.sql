create table public.projects (
  id text primary key,
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 1000),
  project_type text not null default 'Data' check (char_length(project_type) between 1 and 40),
  technologies text[] not null default '{}',
  preview_type text not null check (preview_type in ('chart', 'code', 'dashboard', 'graph')),
  url text not null check (url ~ '^https://'),
  accent text not null check (accent in ('violet', 'cyan')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Published projects are publicly readable"
  on public.projects for select
  to anon, authenticated
  using (published = true);

create index projects_published_created_at_idx
  on public.projects (published, created_at desc);

insert into public.projects (id, title, description, project_type, technologies, preview_type, url, accent, published)
values
  ('churn-analysis-project', 'Customer Churn Analysis', 'Analyse de 7 043 clients télécom, comparaison de modèles de risque et simulateur de scoring pour orienter les actions de fidélisation.', 'Data', array['Python', 'pandas', 'scikit-learn', 'Streamlit'], 'graph', 'https://github.com/opluriel/churn-analysis-project', 'violet', true),
  ('data-analystic-project', 'Global Layoffs Analysis', 'Nettoyage et exploration SQL, puis modélisation et dashboard Power BI sur les licenciements mondiaux de 2020 à 2023.', 'Data', array['MySQL', 'SQL', 'Power BI', 'DAX'], 'chart', 'https://github.com/opluriel/data-analystic-project', 'cyan', true),
  ('data-professional-survey-dashboard', 'Data Professionals Survey', 'Dashboard Power BI basé sur 630 réponses pour explorer les salaires, les outils utilisés et la satisfaction des professionnels de la donnée.', 'Data', array['Power BI', 'Power Query', 'DAX', 'Excel'], 'graph', 'https://github.com/opluriel/data-professional-survey-dashboard', 'violet', true),
  ('bike-buyers-analysis', 'Bike Buyers Analysis', 'Analyse Excel de 1 000 clients pour comparer les taux d’achat de vélos selon l’âge, la distance domicile-travail et d’autres profils.', 'Data', array['Excel', 'Tableaux croisés', 'Dashboard'], 'chart', 'https://github.com/opluriel/bike-buyers-analysis', 'cyan', true);
