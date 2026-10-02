/*
# RexMaths Brain - Core Database Schema

## Overview
Creates the full database schema for RexMaths Brain, a Nigerian primary school mathematics quiz platform.
Students from Primary 1 to Primary 6 take AI-generated quiz questions based on the Nigerian curriculum,
organized by term (First, Second, Third) with weekly coverage. Includes a mental math challenge.

## New Tables
1. `students` - Registered student profiles (linked to auth.users)
2. `quiz_attempts` - Records each quiz attempt with scores
3. `question_bank` - Pre-generated questions for reuse tracking

## Security
- RLS on all tables
- Owner-scoped policies for students and quiz_attempts
- Admin email check for admin-level access
*/

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  full_name text NOT NULL,
  class_level text NOT NULL CHECK (class_level IN ('Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6')),
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  registration_paid boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_student" ON students;
CREATE POLICY "select_own_student" ON students FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_student" ON students;
CREATE POLICY "insert_own_student" ON students FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_student" ON students;
CREATE POLICY "update_own_student" ON students FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_read_all_students" ON students;
CREATE POLICY "admin_read_all_students" ON students FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'talk2nomso@gmail.com')
  );

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_level text NOT NULL,
  term text NOT NULL CHECK (term IN ('First Term', 'Second Term', 'Third Term')),
  question_ids text[] DEFAULT '{}',
  answers jsonb DEFAULT '{}',
  score integer DEFAULT 0,
  total_questions integer DEFAULT 40,
  percentage numeric DEFAULT 0,
  quiz_type text NOT NULL DEFAULT 'curriculum' CHECK (quiz_type IN ('curriculum', 'mental_math')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON quiz_attempts;
CREATE POLICY "select_own_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON quiz_attempts;
CREATE POLICY "insert_own_attempts" ON quiz_attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_attempts" ON quiz_attempts;
CREATE POLICY "update_own_attempts" ON quiz_attempts FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "admin_read_all_attempts" ON quiz_attempts;
CREATE POLICY "admin_read_all_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'talk2nomso@gmail.com')
  );

-- Question bank table
CREATE TABLE IF NOT EXISTS question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_level text NOT NULL,
  term text,
  week_number integer,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  topic text,
  difficulty text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_question_bank" ON question_bank;
CREATE POLICY "read_question_bank" ON question_bank FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_questions" ON question_bank;
CREATE POLICY "admin_insert_questions" ON question_bank FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'talk2nomso@gmail.com')
  );

DROP POLICY IF EXISTS "admin_update_questions" ON question_bank;
CREATE POLICY "admin_update_questions" ON question_bank FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'talk2nomso@gmail.com')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_class_term ON quiz_attempts(class_level, term);
CREATE INDEX IF NOT EXISTS idx_question_bank_class_term ON question_bank(class_level, term);
