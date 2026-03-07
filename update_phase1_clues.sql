-- Clear existing Phase 1 clues
DELETE FROM clues WHERE phase_number = 1;

-- Populate Phase 1 Clues with updated text
INSERT INTO clues (phase_number, quest_number, clue_text, answer_code) VALUES
(1, 1, 'Where minds gather before they rise,\nBetween floors and flowing ties.\nA place of pause before the climb,\nLook around — the answer waits in time.', 'I'),
(1, 2, 'From the home of ideas, start your walk,\nToward the block where "B" leads the talk.\nAs you take the turn, look straight once more \nA giant wall stands guarding....', '4'),
(1, 3, 'The number four has shown the way,\nNow let your journey continue today.\nLeave B behind and move with glee,\nFind the small gate that welcomes P.', '5'),
(1, 4, 'From P your journey now must flow,\nToward the spot where long chats grow.\nA new stall greets you on the way,\nBut glance to the right — the answer will stay.', '1'),
(1, 5, 'Conversations done, move ahead with aim,\nToward the block of talks, careers, and fame.\nWhere banners dress the outer wall,\nThe final mark awaits your call.', 'S');

-- Update game_state target_word for Phase 1
UPDATE game_state SET target_word = 'I451S' WHERE id = 1;
