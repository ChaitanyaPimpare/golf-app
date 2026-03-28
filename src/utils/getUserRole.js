import { supabase } from "../supabase"

export const getUserProfile = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error("Auth Error:", userError)
    return null
  }

  if (!userData?.user) {
    console.warn("No user found")
    return null
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  if (error) {
    console.error("Profile Fetch Error:", error)
    return null
  }

  if (!profile) {
    console.warn("Profile not found in DB")
    return null
  }

  return profile
}