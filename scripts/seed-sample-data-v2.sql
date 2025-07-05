-- Insert sample hotels with INR pricing for Indian market
INSERT INTO hotels (name, description, price_per_night, city, image_url, amenities, rating) VALUES
('Taj Palace Heritage', 'Luxury heritage hotel with royal architecture and traditional hospitality', 12500, 'Mumbai', '/placeholder.svg?height=300&width=500', '["Swimming Pool", "Spa", "Fine Dining", "Cultural Shows", "Valet Parking"]', 4.9),
('Business Center Plaza', 'Modern business hotel in the heart of the financial district', 4200, 'Mumbai', '/placeholder.svg?height=300&width=500', '["Business Center", "Gym", "Restaurant", "Free WiFi", "Conference Rooms"]', 4.5),
('Backpacker''s Paradise', 'Budget-friendly hostel with modern amenities for young travelers', 850, 'Mumbai', '/placeholder.svg?height=300&width=500', '["Shared Kitchen", "Common Area", "Free WiFi", "Laundry", "Travel Desk"]', 4.2),

('Royal Rajasthan Resort', 'Experience royal luxury in the heart of the Pink City', 8900, 'Jaipur', '/placeholder.svg?height=300&width=500', '["Palace Architecture", "Swimming Pool", "Spa", "Cultural Programs", "Fine Dining"]', 4.8),
('City Center Inn', 'Comfortable stay near major attractions and shopping areas', 2800, 'Jaipur', '/placeholder.svg?height=300&width=500', '["Restaurant", "Room Service", "Free WiFi", "Parking", "Tour Desk"]', 4.3),
('Desert Winds Hostel', 'Budget accommodation with authentic Rajasthani experience', 650, 'Jaipur', '/placeholder.svg?height=300&width=500', '["Shared Rooms", "Rooftop Terrace", "Cultural Activities", "Free Breakfast", "WiFi"]', 4.1),

('Ganga View Palace', 'Spiritual retreat with stunning views of the holy river', 6500, 'Varanasi', '/placeholder.svg?height=300&width=500', '["River View", "Yoga Classes", "Meditation Hall", "Ayurvedic Spa", "Vegetarian Restaurant"]', 4.7),
('Pilgrim''s Rest', 'Simple and clean accommodation for spiritual travelers', 1500, 'Varanasi', '/placeholder.svg?height=300&width=500', '["Clean Rooms", "Vegetarian Meals", "Prayer Room", "Free WiFi", "Laundry"]', 4.0),

('Kerala Backwater Resort', 'Luxury resort amidst serene backwaters and coconut groves', 9800, 'Kochi', '/placeholder.svg?height=300&width=500', '["Backwater View", "Ayurvedic Spa", "Houseboat Rides", "Swimming Pool", "Kerala Cuisine"]', 4.9),
('Spice Garden Hotel', 'Boutique hotel surrounded by spice plantations', 3500, 'Kochi', '/placeholder.svg?height=300&width=500', '["Garden View", "Spice Tours", "Restaurant", "Free WiFi", "Airport Transfer"]', 4.4),

('Himalayan Retreat', 'Mountain resort with breathtaking views of snow-capped peaks', 7200, 'Manali', '/placeholder.svg?height=300&width=500', '["Mountain View", "Adventure Sports", "Bonfire", "Multi-cuisine Restaurant", "Spa"]', 4.6),
('Valley View Lodge', 'Cozy accommodation perfect for nature lovers', 2200, 'Manali', '/placeholder.svg?height=300&width=500', '["Valley View", "Trekking Assistance", "Local Cuisine", "Free WiFi", "Parking"]', 4.2);

-- Insert sample user posts with Indian context
INSERT INTO user_posts (user_id, user_name, user_avatar, content, location_name, city, image_url, likes_count) VALUES
('user1', 'Priya Sharma', '/placeholder.svg?height=40&width=40', 'Just witnessed the most beautiful sunrise at Taj Mahal! The golden hour here is absolutely magical. Every Indian should visit this wonder at least once. 🕌✨', 'Taj Mahal', 'Agra', '/placeholder.svg?height=400&width=600', 24),
('user2', 'Rahul Kumar', '/placeholder.svg?height=40&width=40', 'Street food tour in Old Delhi was incredible! Had the best chole bhature and jalebi. The flavors and chaos of Chandni Chowk is an experience in itself! 🍛🎉', 'Chandni Chowk', 'Delhi', '/placeholder.svg?height=400&width=600', 18),
('user3', 'Ananya Patel', '/placeholder.svg?height=40&width=40', 'Backwater cruise in Alleppey was so peaceful. Staying in a traditional houseboat and eating fresh fish curry while watching the sunset - pure bliss! 🛶🌅', 'Alleppey Backwaters', 'Kochi', '/placeholder.svg?height=400&width=600', 31),
('user4', 'Vikram Singh', '/placeholder.svg?height=40&width=40', 'Trekking in the Himalayas near Manali. The air is so fresh and the views are breathtaking. Met some amazing fellow travelers from different states! 🏔️🥾', 'Solang Valley', 'Manali', '/placeholder.svg?height=400&width=600', 27),
('user5', 'Meera Reddy', '/placeholder.svg?height=40&width=40', 'Evening aarti at Dashashwamedh Ghat in Varanasi was a spiritual experience like no other. The energy and devotion here is incredible! 🙏🕯️', 'Dashashwamedh Ghat', 'Varanasi', '/placeholder.svg?height=400&width=600', 22),
('user6', 'Arjun Nair', '/placeholder.svg?height=40&width=40', 'Palace hopping in Jaipur! The architecture and history of City Palace and Hawa Mahal is mind-blowing. Rajasthan''s royal heritage is unmatched! 🏰👑', 'City Palace', 'Jaipur', '/placeholder.svg?height=400&width=600', 19);

-- Insert sample chat messages with Indian context
INSERT INTO chat_messages (user_id, user_name, user_avatar, message, city) VALUES
('user1', 'Priya', '/placeholder.svg?height=32&width=32', 'Anyone been to Hampi recently? Planning a trip next month and looking for budget accommodation suggestions!', 'Mumbai'),
('user2', 'Rahul', '/placeholder.svg?height=32&width=32', 'Just returned from Hampi! Stay at Gopi Guesthouse - clean, cheap (₹800/night) and great location near the ruins.', 'Mumbai'),
('user3', 'Ananya', '/placeholder.svg?height=32&width=32', 'What''s the best time to visit Ladakh? Heard the roads can be tricky during monsoon.', 'Delhi'),
('user4', 'Vikram', '/placeholder.svg?height=32&width=32', 'June to September is perfect for Ladakh! Roads are clear and weather is pleasant. Book accommodation in advance though.', 'Delhi'),
('user5', 'Meera', '/placeholder.svg?height=32&width=32', 'Looking for travel buddies for a Kerala backwater trip in December. Anyone interested?', 'Bangalore'),
('user6', 'Arjun', '/placeholder.svg?height=32&width=32', 'Count me in for Kerala! I''ve been planning the same trip. We can split the houseboat costs.', 'Bangalore'),
('user7', 'Kavya', '/placeholder.svg?height=32&width=32', 'Best street food spots in Jaipur? Going there this weekend!', 'Jaipur'),
('user8', 'Rohit', '/placeholder.svg?height=32&width=32', 'Try Laxmi Misthan Bhandar for sweets and Rawat Mishthan for kachori! Both are legendary.', 'Jaipur');
