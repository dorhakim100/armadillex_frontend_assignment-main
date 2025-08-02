export const inputs = [
  {
    type: 'email',
    label: 'Email',
    icon: 'email',
    rules: [
      (val) => !!val || 'Email is required',
      (val) => val.includes('@') || 'Please enter a valid email',
    ],
  },
  {
    type: 'password',
    label: 'Password',
    icon: 'lock',
    rules: [
      (val) => !!val || 'Password is required',
      (val) => val.length >= 6 || 'Password must be at least 6 characters',
    ],
  },
]
