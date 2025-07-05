-- Insert sample user profiles (these would normally be created via auth)
INSERT INTO profiles (id, full_name, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Adventure Seeker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Foodie Explorer', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Local Guide', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Travel Buddy', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face')
ON CONFLICT (id) DO NOTHING;

-- Insert sample posts
INSERT INTO user_posts (id, user_id, title, content, location, latitude, longitude, likes, comments) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Hidden Gems in the Mountains', 'Just discovered this amazing viewpoint that''s not on any tourist map! The sunrise here is absolutely breathtaking. Perfect spot for photography and meditation. The trek takes about 2 hours but it''s totally worth it.', 'Manali, India', 32.2396, 77.1887, 15, 3),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Best Local Restaurant Find!', 'Found this incredible family-run restaurant serving authentic local cuisine. The owner shared stories about traditional recipes passed down for generations. Must try their signature dish - it''s a flavor explosion!', 'Delhi, India', 28.6139, 77.2090, 23, 7),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Budget Travel Tips for Backpackers', 'Sharing some money-saving tips I''ve learned during my travels. Stay in hostels, use public transport, eat street food (safely!), and always negotiate prices. You can travel on $20-30 per day in most places.', 'Goa, India', 15.2993, 74.1240, 31, 12),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Solo Female Travel Safety', 'Important safety tips for solo female travelers. Trust your instincts, research your destination, share your itinerary with someone, and always have backup plans. Don''t let fear stop you from exploring!', 'Mumbai, India', 19.0760, 72.8777, 45, 18),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Photography Spots in Kerala', 'Kerala is a photographer''s paradise! From the backwaters to tea plantations, every corner offers stunning shots. Best time is early morning or golden hour. Don''t forget to capture the local culture too.', 'Kerala, India', 10.8505, 76.2711, 28, 9);

-- Insert sample chat messages
INSERT INTO chat_messages (id, user_id, message, location, latitude, longitude) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Hey everyone! Just arrived here. Any recommendations for good local food?', 'Delhi, India', 28.6139, 77.2090, NOW() - INTERVAL '2 hours'),
  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Welcome! You should definitely try the street food near the main market. Amazing flavors!', 'Delhi, India', 28.6139, 77.2090, NOW() - INTERVAL '1 hour 30 minutes'),
  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Also check out Karim''s for authentic Mughlai cuisine. It''s been around since 1913!', 'Delhi, India', 28.6139, 77.2090, NOW() - INTERVAL '1 hour'),
  ('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Anyone up for a group trek tomorrow? I know some great trails around here.', 'Manali, India', 32.2396, 77.1887, NOW() - INTERVAL '45 minutes'),
  ('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Count me in! What time should we meet?', 'Manali, India', 32.2396, 77.1887, NOW() - INTERVAL '30 minutes');
