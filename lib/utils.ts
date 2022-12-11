import bcrypt from 'bcryptjs'

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword)
}

// only client
export default function refreshSession() {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event)
}
