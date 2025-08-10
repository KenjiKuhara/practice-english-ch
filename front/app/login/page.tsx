import { redirectIfAuthenticated } from '@/app/lib/utils/auth'
import LoginForm from './login-form'

export default async function LoginPage() {
  // すでにログインしている場合はメイン画面にリダイレクト
  await redirectIfAuthenticated('/')
  
  return <LoginForm />
}
