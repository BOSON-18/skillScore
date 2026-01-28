ALTER TABLE job_roles
ADD COLUMN min_years_of_experience INTEGER NOT NULL DEFAULT 0;

ALTER TABLE job_roles
ADD CONSTRAINT min_years_of_experience_non_negative
CHECK (min_years_of_experience >= 0);
