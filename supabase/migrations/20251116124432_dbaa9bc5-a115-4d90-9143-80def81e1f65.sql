-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('student', 'mentor', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  avatar TEXT,
  semester INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create groups table
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  semester INT CHECK (semester >= 3 AND semester <= 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create group_mentors junction table
CREATE TABLE public.group_mentors (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, mentor_id)
);

-- Create group_members table
CREATE TABLE public.group_members (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, student_id)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'submitted', 'done')),
  semester INT,
  file_urls TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create task_assignees junction table
CREATE TABLE public.task_assignees (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, student_id)
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT,
  file_url TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  grade INT CHECK (grade >= 0 AND grade <= 100),
  feedback TEXT,
  rubric JSONB
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  file_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for groups
CREATE POLICY "Mentors can view own groups"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = groups.id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own group"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can create groups"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'mentor'));

-- RLS Policies for group_mentors
CREATE POLICY "Anyone can view group mentors"
  ON public.group_mentors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mentors can add themselves to groups"
  ON public.group_mentors FOR INSERT
  TO authenticated
  WITH CHECK (mentor_id = auth.uid() AND public.has_role(auth.uid(), 'mentor'));

-- RLS Policies for group_members
CREATE POLICY "Group members visible to group"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_mentors gm
      WHERE gm.group_id = group_members.group_id AND gm.mentor_id = auth.uid()
    )
  );

CREATE POLICY "Students can join groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid() AND public.has_role(auth.uid(), 'student'));

CREATE POLICY "Students can leave groups"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- RLS Policies for tasks
CREATE POLICY "Group members can view tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = tasks.group_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = tasks.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can create tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = tasks.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = tasks.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Students can update task status"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = tasks.group_id AND student_id = auth.uid()
    )
  );

-- RLS Policies for task_assignees
CREATE POLICY "Anyone in group can view assignees"
  ON public.task_assignees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.group_members gm ON t.group_id = gm.group_id
      WHERE t.id = task_assignees.task_id AND gm.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.tasks t
      JOIN public.group_mentors gm ON t.group_id = gm.group_id
      WHERE t.id = task_assignees.task_id AND gm.mentor_id = auth.uid()
    )
  );

-- RLS Policies for submissions
CREATE POLICY "Group members can view submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = submissions.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Students can create submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Mentors can update submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = submissions.group_id AND mentor_id = auth.uid()
    )
  );

-- RLS Policies for notices
CREATE POLICY "Everyone can view notices"
  ON public.notices FOR SELECT
  TO authenticated
  USING (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = notices.group_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = notices.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can create notices"
  ON public.notices FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'mentor') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for messages
CREATE POLICY "Group members can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = messages.group_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = messages.group_id AND mentor_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = messages.group_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_mentors
      WHERE group_id = messages.group_id AND mentor_id = auth.uid()
    )
  );

-- Enable realtime for messages and tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false);

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage policies for submissions
CREATE POLICY "Students can upload own submissions"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Group members can view submissions"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
  );

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();