-- Inserts the starting records only when the table is empty, so it is safe to run twice.
INSERT INTO records (title, category, description, status)
SELECT v.title, v.category, v.description, v.status
FROM (VALUES
  ('Wi-Fi drops in the library', 'Network', 'The Wi-Fi disconnects every few minutes on the second floor of the library.', 'Pending'),
  ('Cannot install Python', 'Software', 'The installer stops at 80 percent on the lab 3 computers.', 'In progress'),
  ('Laptop screen flickers', 'Hardware', 'The screen flickers when the laptop is on battery power.', 'Pending'),
  ('Printer jams in Lab 2', 'Printing', 'The lab printer jams on every second page and needs a service.', 'Completed'),
  ('Student portal password reset', 'Account', 'The reset email never arrives for my student account.', 'In progress'),
  ('Projector not detected', 'Hardware', 'Room B12 laptop does not detect the HDMI projector.', 'Pending'),
  ('Antivirus update failing', 'Software', 'The antivirus shows an error when it tries to update definitions.', 'Completed'),
  ('No internet in hostel block C', 'Network', 'Block C has had no internet connection since Monday morning.', 'In progress')
) AS v(title, category, description, status)
WHERE NOT EXISTS (SELECT 1 FROM records);
