import { redirectIfAuthenticated } from '@/app/lib/utils/auth'
import SignUpForm from './signup-form'

export default async function SignUpPage() {
  // すでにログインしている場合はメイン画面にリダイレクト
  await redirectIfAuthenticated('/')
  
  return <SignUpForm />
}
