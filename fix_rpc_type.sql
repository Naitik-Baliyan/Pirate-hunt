-- ============================================================
-- CRITICAL FIX: declare_phase_winner RPC type mismatch
-- The original function used `uuid` for p_participant_id but
-- participant IDs are TEXT (e.g. "PIRATE-xxx-xxx"). This caused
-- silent failures — no phase winner was ever declared.
-- Run this in Supabase SQL Editor to fix winner declaration.
-- ============================================================

DROP FUNCTION IF EXISTS public.declare_phase_winner(uuid, integer);

CREATE OR REPLACE FUNCTION public.declare_phase_winner(
  p_participant_id text,
  p_phase_number integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_winner_declared boolean;
BEGIN
  -- Lock the game_state row to prevent race conditions
  SELECT
    CASE
      WHEN p_phase_number = 1 THEN phase1_winner_declared
      WHEN p_phase_number = 2 THEN phase2_winner_declared
      WHEN p_phase_number = 3 THEN phase3_winner_declared
      ELSE true
    END
  INTO v_winner_declared
  FROM public.game_state
  WHERE id = 1
  FOR UPDATE;

  -- If a winner was already declared for this phase, bail
  IF v_winner_declared THEN
    RETURN false;
  END IF;

  -- Declare the winner for the appropriate phase
  IF p_phase_number = 1 THEN
    UPDATE public.game_state SET phase1_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET is_phase1_winner = true WHERE participant_id = p_participant_id;

  ELSIF p_phase_number = 2 THEN
    UPDATE public.game_state SET phase2_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET is_phase2_winner = true WHERE participant_id = p_participant_id;

  ELSIF p_phase_number = 3 THEN
    UPDATE public.game_state
    SET phase3_winner_declared = true,
        hunt_status = 'completed'
    WHERE id = 1;
    UPDATE public.participants SET is_phase3_winner = true WHERE participant_id = p_participant_id;
  END IF;

  RETURN true;
END;
$$;

-- Grant execute permission to the anon role (used by Supabase client)
GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO service_role;
