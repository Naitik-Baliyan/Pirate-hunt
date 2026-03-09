-- ============================================================
-- COMPLETE DATABASE FIX SCRIPT
-- Run this in Supabase SQL Editor to fix all DB issues:
-- 1. Add missing Phase 2 clues
-- 2. Remove duplicate Phase 3 clues (keep only 1 of each)
-- 3. Update declare_phase_winner to use real column names
-- ============================================================

-- ── STEP 1: Add missing Phase 2 clues ─────────────────────
-- First check if Phase 2 clues already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM clues WHERE phase_number = 2) THEN
    INSERT INTO clues (phase_number, quest_number, clue_text, answer) VALUES
    (2, 1, 'Enter the land where thinkers roam, Beyond the gate of Azim''s home. A curved old stall now silent stays, Look nearby to begin the chase.', '7'),
    (2, 2, 'Leave the curved silence behind your view, Walk ahead where the letter B calls you. At its gate where messages often stay, Between the pillars your next mark will lay.', 'H'),
    (2, 3, 'From B continue your steady pace, Toward the block where P marks the place. Two paths of steps will split the way, One climbs high, one dips to stay. Choose the path that journeys down, Your next symbol waits around.', '3'),
    (2, 4, 'Leave the steps of P behind, Walk the path where lights align. Toward the place where long nights grow, At its first walls the next sign will show.', 'N'),
    (2, 5, 'Leave the halls of LP behind, Toward Raman where ambitions shine. Climb the steps where journeys rise, A waiting space before your eyes. Pause a moment, look once more — The final mark rests near the floor.', '4');
    RAISE NOTICE 'Phase 2 clues inserted successfully';
  ELSE
    RAISE NOTICE 'Phase 2 clues already exist — skipping insert';
  END IF;
END $$;

-- ── STEP 2: Remove duplicate Phase 3 clues ─────────────────
-- Keep only the oldest entry (lowest id) per quest number in Phase 3
DELETE FROM clues
WHERE phase_number = 3
  AND id NOT IN (
    SELECT MIN(id)
    FROM clues
    WHERE phase_number = 3
    GROUP BY quest_number
  );

-- ── STEP 3: Recreate declare_phase_winner with correct column names ──
DROP FUNCTION IF EXISTS public.declare_phase_winner(text, integer);
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
  -- Lock game_state row to prevent race conditions
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

  IF v_winner_declared THEN
    RETURN false;
  END IF;

  IF p_phase_number = 1 THEN
    UPDATE public.game_state SET phase1_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET phase1_completed = true WHERE participant_id = p_participant_id;

  ELSIF p_phase_number = 2 THEN
    UPDATE public.game_state SET phase2_winner_declared = true WHERE id = 1;
    UPDATE public.participants SET phase2_completed = true WHERE participant_id = p_participant_id;

  ELSIF p_phase_number = 3 THEN
    UPDATE public.game_state
    SET phase3_winner_declared = true,
        winner_declared = true
    WHERE id = 1;
    UPDATE public.participants
    SET phase3_winner = true,
        phase3_completed = true
    WHERE participant_id = p_participant_id;
  END IF;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.declare_phase_winner(text, integer) TO service_role;

-- ── STEP 4: Verify final state ─────────────────────────────
SELECT phase_number, quest_number, answer, LEFT(clue_text, 40) as clue_preview
FROM clues
ORDER BY phase_number, quest_number;
