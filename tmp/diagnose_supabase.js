import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function diagnose() {
    console.log("--- 1. Checking 'clues' table ---")
    const { data: allClues, error: cluesError } = await supabase
        .from('clues')
        .select('*')

    if (cluesError) {
        console.error("Error fetching clues:", cluesError.message)
    } else {
        const grouped = {}
        allClues.forEach(c => {
            const phase = c.phase || 'unknown'
            if (!grouped[phase]) grouped[phase] = []
            grouped[phase].push(c)
        })

        Object.keys(grouped).forEach(phase => {
            console.log(`\nPhase ${phase}:`)
            console.table(grouped[phase].map(c => ({
                id: c.id,
                quest: c.quest_number,
                location: c.location,
                clue: c.clue || c.clue_text, // checking both as code used clue_text
                answer: c.answer
            })))
            console.log(`Total clues for Phase ${phase}: ${grouped[phase].length}`)
        })
        console.log(`\nTotal clues across all phases: ${allClues.length}`)
    }

    console.log("\n--- 2. Verifying schema of 'clues' table ---")
    // Note: We can only infer from returned data or RPC if available.
    // Standard Supabase JS doesn't have a direct 'describe table' unless we use RPC
    // But we can check keys of a sample row.
    if (allClues && allClues.length > 0) {
        console.log("Column names found in data:", Object.keys(allClues[0]))
    } else {
        console.log("No rows found. Checking table existence via error or empty result.")
    }

    console.log("\n--- 3. Checking 'participants' table ---")
    const { data: participants, error: pError } = await supabase
        .from('participants')
        .select('*')
        .limit(5)

    if (pError) {
        console.error("Error fetching participants:", pError.message)
    } else if (participants.length > 0) {
        console.log("Sample Participants Data:")
        console.table(participants.map(p => ({
            id: p.id,
            name: p.name,
            current_phase: p.current_phase,
            current_quest: p.current_quest,
            letters_collected: p.letters_collected
        })))
    } else {
        console.log("No participants found.")
    }

    console.log("\n--- 4. Checking 'game_state' table ---")
    const { data: gameState, error: gsError } = await supabase
        .from('game_state')
        .select('*')
        .single()

    if (gsError) {
        console.error("Error fetching game_state:", gsError.message)
    } else {
        console.log("Current Game State:")
        console.table([gameState])
    }

    const currentPhase = gameState?.current_phase || 1
    // Simulation of frontend query
    console.log(`\n--- 5. Simulating frontend query (Phase=${currentPhase}) ---`)
    const { data: simulatedData, error: simError } = await supabase
        .from('clues')
        .select('*')
        .eq('phase', currentPhase)
        .order('quest_number', { ascending: true })

    if (simError) {
        console.error("Simulation query failed:", simError.message)
    } else {
        console.log(`Simulation returned ${simulatedData.length} records.`)
        if (simulatedData.length === 0) {
            console.log("REASON FOR EMPTY RESULT:")
            if (allClues && allClues.length > 0) {
                const phasesAvailable = [...new Set(allClues.map(c => c.phase))]
                console.log(`- Database has data for phases: ${phasesAvailable.join(', ')}`)
                console.log(`- Filtered query for phase ${currentPhase} returned nothing.`)
            } else {
                console.log("- Database table 'clues' is completely empty.")
            }
        }
    }

    // Generate sample data if empty
    if ((!allClues || allClues.length === 0) && !cluesError) {
        console.log("\n--- 6. Generating Sample Data ---")
        const sampleClues = []
        for (let p = 1; p <= 3; p++) {
            for (let q = 1; q <= 5; q++) {
                sampleClues.push({
                    phase: p,
                    quest_number: q,
                    location: `Pirate Haven ${p}-${q}`,
                    clue: `Sample clue for Phase ${p} Quest ${q}: Search near the phantom anchor!`,
                    clue_text: `Sample clue for Phase ${p} Quest ${q}: Search near the phantom anchor!`,
                    answer: 'X'
                })
            }
        }
        console.log("Inserting 15 sample clues...")
        const { error: insertError } = await supabase
            .from('clues')
            .insert(sampleClues)

        if (insertError) {
            console.error("Error inserting sample data:", insertError.message)
            if (insertError.message.includes('permission denied')) {
                console.log("Check RLS policies if you have permission denied.");
            }
        } else {
            console.log("Sample clues (15 total) successfully inserted into Supabase.");

            // Re-verify after insertion
            const { data: verifyData } = await supabase.from('clues').select('*')
            console.log(`Verified clues in DB after insertion: ${verifyData?.length || 0}`)
        }
    }
}

diagnose().then(() => console.log("\n--- DIAGNOSTICS COMPLETE ---")).catch(e => console.error("DIAGNOSTICS FAILED:", e))
