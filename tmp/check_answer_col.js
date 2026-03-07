import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
    console.log("Checking columns in 'clues' table...")
    const { data, error } = await supabase.from('clues').select('*').limit(1)

    if (error) {
        console.error("Error fetching clues:", error.message)
        return
    }

    if (data.length > 0) {
        console.log("Current columns:", Object.keys(data[0]))
        if (Object.keys(data[0]).includes('answer')) {
            console.log("Column 'answer' EXISTS.")
        } else {
            console.log("Column 'answer' MISSING.")
        }
    } else {
        console.log("Table is empty. Checking schema by attempting a test insert with 'answer'...")
        const { error: insertError } = await supabase.from('clues').insert({
            phase: 1,
            quest_number: 99,
            location: 'test',
            clue_text: 'test',
            answer: 'test'
        })

        if (insertError && insertError.message.includes("column \"answer\" of relation \"clues\" does not exist")) {
            console.log("Column 'answer' MISSING (verified via failed insert).")
        } else if (!insertError) {
            console.log("Column 'answer' EXISTS (verified via successful insert).")
            // Cleanup
            await supabase.from('clues').delete().eq('quest_number', 99)
        } else {
            console.log("Insert failed with error:", insertError.message)
        }
    }
}

checkSchema()
