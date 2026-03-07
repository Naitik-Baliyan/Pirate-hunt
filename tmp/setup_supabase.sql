-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS clues CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS game_state CASCADE;

-- 1. Table: game_state
CREATE TABLE game_state (
  id integer PRIMARY KEY DEFAULT 1,
  current_phase integer DEFAULT 1,
  winner_declared boolean DEFAULT false,
  active_quest integer DEFAULT 1,
  target_word text DEFAULT 'ECELL'
);

INSERT INTO game_state (id, current_phase, winner_declared, active_quest, target_word)
VALUES (1, 1, false, 1, 'I451S');

-- 2. Table: clues
CREATE TABLE clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number integer NOT NULL,
  quest_number integer NOT NULL,
  clue_text text NOT NULL,
  answer_code text NOT NULL
);

-- Populate Phase 1 Clues
INSERT INTO clues (phase_number, quest_number, clue_text, answer_code) VALUES
(1, 1, 'Where minds gather before they rise, Between floors and flowing ties. A place of pause before the climb, Look around — the answer waits in time.', 'I'),
(1, 2, 'From the home of ideas, start your walk, Toward the block where B leads the talk. As you take the turn, look straight once more, A giant wall stands guarding.', '4'),
(1, 3, 'The number four has shown the way, Now let your journey continue today. Leave B behind and move with glee, Find the small gate that welcomes P.', '5'),
(1, 4, 'From P your journey now must flow, Toward the spot where long chats grow. A new stall greets you on the way, But glance to the right — the answer will stay.', '1'),
(1, 5, 'Conversations done, move ahead with aim, Toward the block of talks, careers, and fame. Where banners dress the outer wall, The final mark awaits your call.', 'S');

-- Populate Phase 2 Clues
INSERT INTO clues (phase_number, quest_number, clue_text, answer_code) VALUES
(2, 1, 'Enter the land where thinkers roam, Beyond the gate of Azim’s home. A silent curved structure waits nearby, Look around before passing by.', '7'),
(2, 2, 'Leave the silence behind your view, Walk ahead where the letter B calls you. At its gate where messages often stay, Between tall pillars your mark will lay.', 'H'),
(2, 3, 'From B continue your steady pace, Toward the block where P marks the place. Two paths of steps will split the way, One climbs high, one dips to stay. Choose the path that journeys down.', '3'),
(2, 4, 'Leave the steps of P behind, Walk the path where lights align. Toward the place where long nights grow, At its starting wall the sign will show.', 'N'),
(2, 5, 'Leave the halls of LP behind, Toward Raman where ambitions shine. Climb the steps where journeys rise, A waiting space appears before your eyes. Look near the floor to find the sign.', '4');

-- 3. Table: participants
CREATE TABLE participants (
  participant_id text PRIMARY KEY,
  name text,
  roll_number text,
  branch text,
  current_phase integer DEFAULT 1,
  current_quest_index integer DEFAULT 1,
  letters_collected text[] DEFAULT '{}'::text[],
  phase1_time timestamp with time zone,
  phase2_time timestamp with time zone,
  start_time timestamp with time zone,
  completion_time timestamp with time zone,
  completion_duration integer,
  is_phase1_winner boolean DEFAULT false,
  is_phase2_winner boolean DEFAULT false
);

-- Enable realtime for tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'game_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE participants;
  END IF;
END $$;
