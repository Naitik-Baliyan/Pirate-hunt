-- ============================================================
-- SYSTEM RESET SCRIPT (ATOMIC)
-- This script resets all participants and the game state to Phase 1.
-- ============================================================

BEGIN;

-- 1. Reset Game State Table
-- We set the starting phase to 1 and reset all winner flags.
UPDATE public.game_state
SET 
    current_phase = 1,
    hunt_status = 'active',
    phase1_winner_declared = false,
    phase2_winner_declared = false,
    phase3_winner_declared = false,
    winner_declared = false,
    phase_winner_id = NULL
WHERE id = 1;

-- Handle current_word/target_word column variations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='game_state' AND column_name='current_word') THEN
        UPDATE public.game_state SET current_word = 'I451S' WHERE id = 1;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='game_state' AND column_name='target_word') THEN
        UPDATE public.game_state SET target_word = 'I451S' WHERE id = 1;
    END IF;
END $$;

-- 2. Reset Participants Table
-- This clears progress for all participants without deleting them.
-- Returning users will find themselves back at Phase 1, Quest 1.
UPDATE public.participants
SET 
    current_phase = 1,
    current_quest_index = 1,
    letters_collected = ARRAY[]::text[],
    is_phase1_winner = false,
    is_phase2_winner = false,
    is_phase3_winner = false,
    phase1_completed = false,
    phase2_completed = false,
    phase3_completed = false,
    phase3_winner = false,
    start_time = NULL,
    completion_time = NULL,
    completion_duration = NULL,
    phase1_time = NULL,
    phase2_time = NULL,
    phase3_time = NULL;

-- 3. Verify Clues Integrity
-- Ensure we have the basic clues for Phase 1 at least.
-- (Clues for Phase 2 and 3 are usually static but this ensures they aren't empty)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.clues WHERE phase_number = 1) THEN
        INSERT INTO public.clues (phase_number, quest_number, clue_text, answer) VALUES
        (1, 1, 'Near the entrance... where things begins.', 'I'),
        (1, 2, 'The central hub...', '4'),
        (1, 3, 'Old library...', '5'),
        (1, 4, 'Modern wing...', '1'),
        (1, 5, 'Final gate...', 'S');
    END IF;
END $$;

COMMIT;
