-- Phase 2 Transition Script
-- 1. Update Game State to Phase 2
UPDATE public.game_state
SET 
  current_phase = 2,
  phase1_winner_declared = true,
  target_word = '7H3N4'
WHERE id = 1;

-- 2. Add columns to preserve Phase 1 data for record keeping
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='participants' AND column_name='phase1_letters_final') THEN
        ALTER TABLE public.participants ADD COLUMN phase1_letters_final TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='participants' AND column_name='phase1_quest_final') THEN
        ALTER TABLE public.participants ADD COLUMN phase1_quest_final INTEGER;
    END IF;
END $$;

-- 3. Transition all participants to Phase 2
-- Move everyone who was in Phase 1 or Phase 4 (terminal winner state)
-- Capture their Phase 1 final state before resetting for Phase 2
UPDATE public.participants
SET 
  phase1_letters_final = letters_collected,
  phase1_quest_final = current_quest_index,
  current_phase = 2,
  current_quest_index = 1,
  letters_collected = '{}',
  completion_time = NULL, -- Reset completion time for the new phase
  completion_duration = NULL -- Reset duration for the new phase
WHERE current_phase = 1 OR current_phase = 4;

-- Note: phase1_time remains preserved as it was already a column in the schema.
