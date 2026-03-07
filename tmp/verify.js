import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verify() {
    const { data: allClues } = await supabase.from('clues').select('id, phase, quest_number, location, clue_text')
    console.log(`Clues in DB: ${allClues?.length || 0}`)

    if (allClues && allClues.length > 0) {
        const grouped = {}
        allClues.forEach(c => {
            grouped[c.phase] = (grouped[c.phase] || 0) + 1
        })
        console.log("Count by Phase:")
        console.table(grouped)

        console.log("\nSample row content:")
        console.table([allClues[0]])
    }
}

verify()
