import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmkvqrxokqzmlrlnntss.supabase.co'
const supabaseKey = 'sb_publishable_8OFbcB4CaVB7_lkfK-kwdw_9PfuTa5R'

export const supabase = createClient(supabaseUrl, supabaseKey)
