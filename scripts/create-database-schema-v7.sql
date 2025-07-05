-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS user_posts CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    budget NUMERIC,
    transport_mode VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotels table
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    price_per_night NUMERIC NOT NULL,
    image_url VARCHAR(255),
    amenities TEXT[],
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(255),
    message TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_posts table
CREATE TABLE user_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    image_url VARCHAR(255),
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can only view their own profile." ON users
AS PERMISSIVE FOR SELECT
TO PUBLIC
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." ON users
AS PERMISSIVE FOR INSERT
TO PUBLIC
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON users
AS PERMISSIVE FOR UPDATE
TO PUBLIC
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policies for trips table
CREATE POLICY "Users can create trips." ON trips
AS PERMISSIVE FOR INSERT
TO PUBLIC
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their own trips." ON trips
AS PERMISSIVE FOR SELECT
TO PUBLIC
USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own trips." ON trips
AS PERMISSIVE FOR UPDATE
TO PUBLIC
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own trips." ON trips
AS PERMISSIVE FOR DELETE
TO PUBLIC
USING (auth.uid() = owner_id);

-- Create policies for hotels table
CREATE POLICY "Users can create hotels." ON hotels
AS PERMISSIVE FOR INSERT
TO PUBLIC
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view all hotels." ON hotels
AS PERMISSIVE FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY "Users can update their own hotels." ON hotels
AS PERMISSIVE FOR UPDATE
TO PUBLIC
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own hotels." ON hotels
AS PERMISSIVE FOR DELETE
TO PUBLIC
USING (auth.uid() = owner_id);

-- Create policies for chat_messages table
CREATE POLICY "Enable read access for all users" ON chat_messages FOR
SELECT
USING (TRUE);

CREATE POLICY "Enable insert access for all users" ON chat_messages FOR
INSERT
WITH CHECK (TRUE);

-- Create policies for user_posts table
CREATE POLICY "Enable read access for all users" ON user_posts FOR
SELECT
USING (TRUE);

CREATE POLICY "Enable insert access for authenticated users" ON user_posts FOR
INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for trips table
CREATE INDEX trips_owner_id_idx ON trips(owner_id);

-- Create index for hotels table
CREATE INDEX hotels_owner_id_idx ON hotels(owner_id);

-- Create index for chat_messages table
CREATE INDEX chat_messages_city_idx ON chat_messages(city);

-- Create index for user_posts table
CREATE INDEX user_posts_user_id_idx ON user_posts(user_id);
