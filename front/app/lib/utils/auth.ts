import { createClient } from '@/app/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * 現在のユーザーセッションを取得する
 */
export async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * ログインが必要なページで使用する関数
 * ログインしていない場合はログインページにリダイレクト
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

/**
 * ログインしている場合にリダイレクトする関数
 * 新規登録・ログインページなどで使用
 */
export async function redirectIfAuthenticated(redirectTo: string = '/') {
  const user = await getCurrentUser()
  
  if (user) {
    redirect(redirectTo)
  }
}
