import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fkzkivvqrelfmjgxeuee.supabase.co"
const supabaseKey = "sb_publishable_z7kNMAPooTu7te0Cq_f74Q_hUP0-0bR"

export const supabase = createClient(supabaseUrl, supabaseKey)