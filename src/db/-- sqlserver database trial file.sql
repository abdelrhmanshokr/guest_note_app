-- sqlserver database trial file


-- first of all create a new schema to contain the new database
-- DROP SCHEMA guest_note_shema;

-- second create a database within that schema
-- SELECT * FROM sys.schemas;

-- USE guest_note;
-- first create a database 
-- CREATE DATABASE guest_note;

-- then create a schema within that database 
-- CREATE SCHEMA guest_note_schema;

-- then create a table using the previously declared schema
-- DROP TABLE IF EXISTS guest_note.guest_note_schema.users;
-- CREATE TABLE guest_note.guest_note_schema.users(
--     user_id INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
--     username VARCHAR(50) NOT NULL,    
--     user_profile_picture VARCHAR(500) NULL,
--     email VARCHAR(50) UNIQUE NOT NULL,
--     user_password VARCHAR(100) NOT NULL,
--     daily_notify_me BIT DEFAULT 1
-- );

-- SELECT ISNULL((SELECT 1 FROM guest_note.guest_note_schema.users WHERE email = 'shodkr@gmail.com'), NULL);
-- SELECT * FROM guest_note.guest_note_schema.users;
-- insert user 1 
-- INSERT INTO guest_note_schema.users(username, email, user_password) 
-- VALUES('shokr', 'shokr@gmail.com', 'password');
-- -- insert user 2
-- INSERT INTO guest_note_schema.users(username, email, user_password) 
-- VALUES('omar', 'omar@gmail.com', 'password');
-- -- insert user 3
-- INSERT INTO guest_note_schema.users(username, email, user_password, daily_notify_me) 
-- VALUES('adel', 'adel@gmail.com', 'password', 0);

-- SELECT * FROM guest_note_schema.users;


-- create the note type table
-- this table has fixed number of types someone like system admin could add more types later
-- DROP TABLE IF EXISTS guest_note.guest_note_schema.note_types;
-- CREATE TABLE guest_note.guest_note_schema.note_types(
--     note_type_id INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
--     note_type_name VARCHAR(50) NOT NULL
-- );

-- INSERT INTO guest_note.guest_note_schema.note_types(note_type_name)
-- VALUES('Invitation');
-- INSERT INTO guest_note.guest_note_schema.note_types(note_type_name)
-- VALUES('Apology');
-- INSERT INTO guest_note.guest_note_schema.note_types(note_type_name)
-- VALUES('Contrats');
-- SELECT * FROM guest_note.guest_note_schema.note_types;


-- create the notes table 
-- DROP TABLE IF EXISTS guest_note.guest_note_schema.notes;
-- CREATE TABLE guest_note.guest_note_schema.notes(
--     note_id INT IDENTITY(1, 1) PRIMARY KEY NOT NULL,
--     note_title VARCHAR(50) NOT NULL,
--     note_content TEXT NOT NULL,
--     created_at DATETIME DEFAULT GETDATE(),
--     is_soft_deleted BIT DEFAULT 0,
--     --    for now media files are just one file to make it easier 
--     --    if there is time it should be one or two files 
--     media_files VARCHAR(500) NULL, 
--     senderId INT FOREIGN KEY
--     REFERENCES guest_note.guest_note_schema.users(user_id),
--     -- for now it's only one sender one receiver to make it easier  
--     receiverId INT FOREIGN KEY 
--     REFERENCES guest_note.guest_note_schema.users(user_id),
--     -- a foreign key refering to note_types
--     note_typeId INT FOREIGN KEY 
--     REFERENCES guest_note.guest_note_schema.note_types(note_type_id)
-- );

-- SELECT * FROM guest_note.guest_note_schema.notes;
-- INSERT INTO guest_note_schema.notes(note_title, note_content, senderId, receiverId, note_typeId)
-- VALUES('note title', 'this is note message', 7, 1, 3);

-- a command used to notify every active user daily 
-- with their new messages it counts all messages from 
-- every type for each user and it joins them and returns the count
-- it's all made to generate something similar to the required output
-- SELECT u.email AS receiver, COUNT(*) AS total_number_of_notes, nt.note_type_name
-- FROM guest_note.guest_note_schema.users AS u
-- JOIN guest_note.guest_note_schema.notes AS n  
-- ON u.user_id = n.receiverId
-- JOIN guest_note.guest_note_schema.note_types AS nt
-- ON n.note_typeId = nt.note_type_id
-- WHERE 
-- u.daily_notify_me = 1 AND 
-- n.is_soft_deleted = 0 AND
-- n.created_at >= GETDATE() - 1
-- GROUP BY u.email, nt.note_type_name;
