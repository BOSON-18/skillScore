ALTER TABLE job_roles
ADD COLUMN max_years_of_experience INTEGER;

ALTER TABLE job_roles
ADD CONSTRAINT job_roles_max_gte_min
CHECK (
  max_years_of_experience IS NULL
  OR max_years_of_experience >= min_years_of_experience
);
