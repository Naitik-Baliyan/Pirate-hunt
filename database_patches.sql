-- Setup modifications for the Supabase SQL Editor
-- This file contains the fixes that MUST be run in the backend PostgreSQL DB

-- 1. Ensure required columns exist just in case
ALTER TABLE public.game_state ADD COLUMN IF NOT EXISTS hunt_status text DEFAULT 'active';
ALTER TABLE public.game_state ADD COLUMN IF NOT EXISTS phase_winner_id uuid REFERENCES public.participants(participant_id);


-- 2. Create the Transactional RPC Function to eliminate race-conditions
CREATE OR REPLACE FUNCTION public.declare_phase_winner(
  p_participant_id uuid,
  p_phase_number integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_winner_declared boolean;
BEGIN
  -- FOR UPDATE locks this row so no other concurrently running queries can read/write it until the transaction completes
  SELECT 
    CASE 
      WHEN p_phase_number = 1 THEN phase1_winner_declared
      WHEN p_phase_number = 2 THEN phase2_winner_declared
      WHEN p_phase_number = 3 THEN phase3_winner_declared
      ELSE false
    END
  INTO v_winner_declared
  FROM public.game_state
  WHERE id = 1
  FOR UPDATE;

  -- If another transaction just snuck in and declared a winner, bail out
  IF v_winner_declared THEN
    RETURN false;
  END IF;

  -- Otherwise, this transaction is exclusively the first. Declare the winner!
  IF p_phase_number = 1 THEN
    UPDATE public.game_state SET phase1_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET is_phase1_winner = true WHERE participant_id = p_participant_id;
  ELSIF p_phase_number = 2 THEN
    UPDATE public.game_state SET phase2_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET is_phase2_winner = true WHERE participant_id = p_participant_id;
  ELSIF p_phase_number = 3 THEN
    UPDATE public.game_state 
    SET phase3_winner_declared = true, 
        hunt_status = 'completed', 
        phase_winner_id = p_participant_id 
    WHERE id = 1;

    -- Update the participant flag
    UPDATE public.participants SET is_phase3_winner = true WHERE participant_id = p_participant_id;
  END IF;

  RETURN true;
END;
$$;
