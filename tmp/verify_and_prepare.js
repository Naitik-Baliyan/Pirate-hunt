import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyAndPopulate() {
    console.log("--- Phase 1 Verification & Preparation ---")

    // 1. Check Schema
    const { data: colsData, error: colsError } = await supabase.from('clues').select('*').limit(1)
    if (colsError) {
        console.error("Error accessing table:", colsError.message)
        return
    }

    const existingCols = colsData.length > 0 ? Object.keys(colsData[0]) : []
    console.log("Existing columns:", existingCols)

    // If table was empty, the colsData might be []
    // Let's check schema via an insert attempt if column list is empty
    let hasAnswer = existingCols.includes('answer')
    if (colsData.length === 0) {
        const { error: testErr } = await supabase.from('clues').insert({ phase: 1, quest_number: -1, answer: 'test' })
        if (testErr && testErr.message.includes("column \"answer\" of relation \"clues\" does not exist")) {
            hasAnswer = false
        } else {
            hasAnswer = true
            await supabase.from('clues').delete().eq('quest_number', -1)
        }
    }

    console.log("Column 'answer' exists:", hasAnswer)

    if (!hasAnswer) {
        console.log("CRITICAL: 'answer' column is still missing. The browser subagent might have failed or the cache hasn't updated.")
        // I will assume for a moment it might need a second. But I'll try to proceed.
        return
    }

    // 2. Clean Table
    console.log("Cleaning clues table...")
    await supabase.from('clues').delete().neq('phase', -999)

    // 3. Insert Phase 1 Data
    const phase1Data = [
        {
            phase: 1,
            quest_number: 1,
            location: "Azim Premji Block",
            clue_text: "Where innovation begins and a visionary's name lives on.",
            answer: "I"
        },
        {
            phase: 1,
            quest_number: 2,
            location: "B Block",
            clue_text: "A building that shares its name with the second letter of the alphabet.",
            answer: "4"
        },
        {
            phase: 1,
            quest_number: 3,
            location: "P Block",
            clue_text: "Many freshers step into this place on their very first day.",
            answer: "5"
        },
        {
            phase: 1,
            quest_number: 4,
            location: "LP Point",
            clue_text: "A place where conversations often last longer than lectures.",
            answer: "1"
        },
        {
            phase: 1,
            quest_number: 5,
            location: "Raman Block",
            clue_text: "Named after the Nobel Prize physicist who studied light.",
            answer: "S"
        }
    ]

    console.log("Inserting Phase 1 clues...")
    const { data: insData, error: insError } = await supabase.from('clues').insert(phase1Data)

    if (insError) {
        console.error("Insertion failed:", insError.message)
    } else {
        console.log("Phase 1 data inserted successfully.")
    }

    // 4. Final Verify
    const { data: finalData } = await supabase
        .from('clues')
        .select('*')
        .eq('phase', 1)
        .order('quest_number', { ascending: true })

    console.log(`\nVerified Rows (Phase 1): ${finalData?.length || 0}`)
    console.table(finalData)

    if (finalData?.length === 5) {
        console.log("\nPhase 1 clues successfully prepared for treasure hunt testing.")
    }
}

verifyAndPopulate()
