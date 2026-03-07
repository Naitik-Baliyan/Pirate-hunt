import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkParticipantsTable() {
    console.log("Checking 'participants' table schema...")
    const { data, error } = await supabase.from('participants').select('*').limit(1)

    if (error) {
        console.error("Error fetching participants:", error.message)
        return
    }

    if (data.length > 0) {
        console.log("Columns in 'participants':", Object.keys(data[0]))
    } else {
        console.log("Participants table is empty.")
    }
}

checkParticipantsTable()
