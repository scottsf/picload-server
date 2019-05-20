import { getFirstName, isValidPassword } from '../utils/test/user'

test("Should return first name when given full name", () => {
  const firstname = getFirstName('Harry Potter')
  expect(firstname).toBe('Harry')
});

test("Should reject when password contains 'password' keyword", () => {
  const invalidPassword = isValidPassword('Password')
  expect(invalidPassword).toBe(false)
})

test("Should reject when password has less than 8 chars", () => {
  const invalidPassword = isValidPassword('abc123')
  expect(invalidPassword).toBe(false)
})

test("Should correctly validate password", () => {
  const validPassword = isValidPassword('abc123Potter')
  expect(validPassword).toBe(true)
})

