import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTop() {
    console.log("Checking leaderboard data...")
    const { data, error } = await supabase
        .from('participants')
        .select('name, completion_duration')
        .not('completion_duration', 'is', null)
        .order('completion_duration', { ascending: true })

    if (error) {
        console.error("Error fetching participants:", error.message)
        return
    }
    console.log(`Found ${data.length} participants with completion_duration:`)
    console.log(data)
}

checkTop()
