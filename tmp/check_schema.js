import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfwdgkxsybfgxlzazywy.supabase.co'
const supabaseAnonKey = 'sb_publishable_n35XnEMidFODTwSNKeFYXQ_Yun9HALl'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
    console.log("Fetching clues without filters to see columns...")
    // We can't actually get column names without data or RPC in JS client easily
    // but we can try to insert a minimal row and see which columns it accepts

    const { data, error } = await supabase.from('clues').select('*').limit(1)
    if (error) {
        console.error("Select Error:", error.message)
        return
    }

    if (data.length > 0) {
        console.log("Columns found in first row:", Object.keys(data[0]))
    } else {
        console.log("No rows found. Let's try to find out which columns exist by trying a blind insert.")
        // Try to insert just 'phase'
        const { error: insError } = await supabase.from('clues').insert({ phase: 1 })
        if (insError) {
            console.log("Insert with just 'phase' failed:", insError.message)
        } else {
            console.log("Insert with just 'phase' succeeded. 'phase' exists.")
        }
    }
}

checkSchema()
