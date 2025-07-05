-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  address TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  image_url TEXT,
  amenities TEXT[],
  rating DECIMAL(3, 1),
  owner_id UUID REFERENCES users(id),
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2),
  transport_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_members table
CREATE TABLE IF NOT EXISTS trip_members (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_expenses table
CREATE TABLE IF NOT EXISTS trip_expenses (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT,
  paid_by TEXT,
  split_with TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_location_id ON chat_messages(location_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_location_id ON posts(location_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_hotels_location_id ON hotels(location_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip_id ON trip_expenses(trip_id);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own locations" ON locations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own messages" ON chat_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own messages" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON post_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to delete own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON hotels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners to update own hotels" ON hotels FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Allow owners to delete own hotels" ON hotels FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Allow users to read own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert" ON expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to read own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert" ON trips FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own trips" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to read own trip members" ON trip_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Allow authenticated insert" ON trip_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own trip members" ON trip_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Allow users to delete own trip members" ON trip_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid())
);

CREATE POLICY "Allow users to read own trip expenses" ON trip_expenses FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Allow authenticated insert" ON trip_expenses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update own trip expenses" ON trip_expenses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Allow users to delete own trip expenses" ON trip_expenses FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
);
