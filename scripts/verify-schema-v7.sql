-- Verify Database Schema v7
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public';
SELECT * FROM users;
SELECT * FROM trips;
SELECT * FROM hotels;
SELECT * FROM chat_messages;
SELECT * FROM user_posts;
