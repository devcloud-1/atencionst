import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET!

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === SESSION_VALUE
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
export const SESSION_COOKIE_VALUE = () => process.env.ADMIN_SESSION_SECRET!
