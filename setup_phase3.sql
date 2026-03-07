-- Clear existing Phase 3 clues
DELETE FROM clues WHERE phase_number = 3;

-- Populate Phase 3 Clues with updated text
INSERT INTO clues (phase_number, quest_number, clue_text, answer_code) VALUES
(3, 1, 'Beneath the halls where minds take flight,\nGo lower where daylight loses sight.\nWhere stories hide in quiet ground,\nThe first old spark is there to be found.', '8'),
(3, 2, 'Among the hum of quiet gears,\nA place where snacks and thirst appears.\nSeek the mark that hides in plain sight,\nNot too high, yet not out of light.', 'P'),
(3, 3, 'Where voices speak through paper walls,\nAnd silent words remind the halls.\nSeek the place where messages stay,\nNot where feet or shadows sway.', '1'),
(3, 4, 'Where footsteps slow and voices fade,\nBeyond the place where talks are made.\nAt the edge where journeys meet the air,\nLook for the spark that waits somewhere.', 'R'),
(3, 5, 'Where echoes sleep behind closed stone,\nAnd voices rest when halls are grown.\nSeek the path where journeys end,\nNear the door where dreams ascend.', '4');

-- Add Phase 3 winner flag to game_state
ALTER TABLE game_state ADD COLUMN IF NOT EXISTS phase3_winner_declared BOOLEAN DEFAULT FALSE;

-- Add Phase 3 time and winner columns to participants
ALTER TABLE participants ADD COLUMN IF NOT EXISTS phase3_time TIMESTAMPTZ;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_phase3_winner BOOLEAN DEFAULT FALSE;

-- Ensure game_state has an entry
INSERT INTO game_state (id, current_phase, phase1_winner_declared, phase2_winner_declared, phase3_winner_declared)
SELECT 1, 1, FALSE, FALSE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM game_state WHERE id = 1);
