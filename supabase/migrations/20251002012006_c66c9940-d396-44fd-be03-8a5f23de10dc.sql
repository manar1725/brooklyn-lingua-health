-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  language TEXT NOT NULL,
  address TEXT NOT NULL,
  specialty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since these are sign-up forms)
CREATE POLICY "Anyone can insert patients"
ON public.patients
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view patients"
ON public.patients
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anyone can insert doctors"
ON public.doctors
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view doctors"
ON public.doctors
FOR SELECT
TO anon
USING (true);