-- Users table (athletes and coaches)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('athlete', 'coach')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date TEXT,
  height REAL,
  weight REAL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_login INTEGER
);

-- Training sessions
DROP TABLE IF EXISTS training_sessions;
CREATE TABLE training_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL, -- 'water', 'ergometer', 'strength', 'technique'
  duration INTEGER NOT NULL, -- minutes
  distance REAL, -- meters
  split_time REAL, -- seconds per 500m
  avg_power REAL, -- watts
  avg_heart_rate REAL,
  max_heart_rate REAL,
  stroke_rate REAL, -- strokes per minute
  notes TEXT,
  coach_feedback TEXT,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  video_url TEXT,
  video_thumbnail_url TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Strength training records
DROP TABLE IF EXISTS strength_records;
CREATE TABLE strength_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight REAL NOT NULL, -- kg
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Training plans
DROP TABLE IF EXISTS training_plans;
CREATE TABLE training_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_id INTEGER NOT NULL,
  user_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT('active') CHECK(status IN ('active', 'completed', 'cancelled')),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (coach_id) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Training plan details
DROP TABLE IF EXISTS plan_details;
CREATE TABLE plan_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER,
  intensity INTEGER CHECK(intensity BETWEEN 1 AND 5),
  FOREIGN KEY (plan_id) REFERENCES training_plans(id) ON DELETE CASCADE
);

-- Coach-student bindings
DROP TABLE IF EXISTS coach_student_bindings;
CREATE TABLE coach_student_bindings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  status TEXT DEFAULT('active') CHECK(status IN ('active', 'inactive')),
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (coach_id) REFERENCES users(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE(coach_id, student_id)
);

-- Technique library
DROP TABLE IF EXISTS technique_library;
CREATE TABLE technique_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'rowing', 'strength'
  description TEXT,
  video_url TEXT,
  image_url TEXT,
  difficulty_level INTEGER CHECK(difficulty_level BETWEEN 1 AND 5),
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Leaderboard entries
DROP TABLE IF EXISTS leaderboard;
CREATE TABLE leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL, -- '500m', '2km', '5km', 'daily_distance', 'monthly_distance'
  value REAL NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Body metrics for progress tracking
DROP TABLE IF EXISTS body_metrics;
CREATE TABLE body_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  weight REAL,
  height REAL,
  body_fat REAL,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for better query performance
CREATE INDEX idx_training_user_date ON training_sessions(user_id, date);
CREATE INDEX idx_strength_user_date ON strength_records(user_id, date);
CREATE INDEX idx_leaderboard_category_date ON leaderboard(category, date);
CREATE INDEX idx_plan_user ON training_plans(user_id);
