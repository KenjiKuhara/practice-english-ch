'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { cookies } from 'next/headers'

export async function signup(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // フォームデータから値を取得
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // バリデーション
  if (!email || !password || !confirmPassword) {
    return {
      error: 'すべてのフィールドを入力してください。'
    }
  }

  if (password !== confirmPassword) {
    return {
      error: 'パスワードが一致しません。'
    }
  }

  if (password.length < 6) {
    return {
      error: 'パスワードは6文字以上で入力してください。'
    }
  }

  // メールアドレスの簡単なバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      error: '有効なメールアドレスを入力してください。'
    }
  }

  try {
    // Supabaseで新規登録
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Signup error:', error)
      
      // Supabaseのエラーを日本語に変換
      let errorMessage = 'アカウントの作成に失敗しました。'
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'このメールアドレスは既に登録されています。'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = '有効なメールアドレスを入力してください。'
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'パスワードは6文字以上で入力してください。'
      }
      
      return {
        error: errorMessage
      }
    }

    // 成功時の処理
    revalidatePath('/', 'layout')
    
    return {
      success: true,
      message: '確認メールを送信しました。メールボックスを確認してアカウントを有効化してください。'
    }
    
  } catch (error) {
    console.error('Unexpected error during signup:', error)
    return {
      error: '予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。'
    }
  }
}

export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // フォームデータから値を取得
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // バリデーション
  if (!email || !password) {
    return {
      error: 'メールアドレスとパスワードを入力してください。'
    }
  }

  // メールアドレスの簡単なバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      error: '有効なメールアドレスを入力してください。'
    }
  }

  try {
    // Supabaseでログイン
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      
      // Supabaseのエラーを日本語に変換
      let errorMessage = 'ログインに失敗しました。'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません。'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスが確認されていません。確認メールをチェックしてください。'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = '有効なメールアドレスを入力してください。'
      }
      
      return {
        error: errorMessage
      }
    }

    // 成功時の処理
    revalidatePath('/', 'layout')
    redirect('/')
    
  } catch (error) {
    console.error('Unexpected error during login:', error)
    return {
      error: '予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。'
    }
  }
}