import { Notify } from 'quasar'

export const notifyService = {
  success: (message) => {
    Notify.create({
      group: 'success',
      message,
      color: 'primary',
      icon: 'check_circle',
      position: 'bottom-right',
      timeout: 3000, // Duration in milliseconds
      actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      progress: true,
    })
  },
  info: (message) => {
    Notify.create({
      group: 'info',
      message,
      color: 'secondary',
      icon: 'info',
      position: 'bottom-right',
      timeout: 300000,
      actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      progress: true,
    })
  },
  error: (message, group = 'error') => {
    Notify.create({
      group,
      message,
      color: 'warning',
      icon: 'error',
      position: 'bottom-right',
      timeout: 3000,
      actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      progress: true,
    })
  },
  actions: (message, actions = []) => {
    Notify.create({
      message: 'This is a custom notification!',
      color: 'purple',
      icon: 'star',
      position: 'bottom-right',
      timeout: 5000,
      actions: [{ icon: 'close', color: 'white', handler: () => {} }, ...actions],
      multiLine: true,
      progress: true,
    })
  },
}

export const notifyMsgs = {
  // auth
  loginSuccess: 'Welcome back ',
  logoutSuccess: 'Logged out successfully.',
  loginFailed: 'Login failed.',
  logoutFailed: 'Logout failed.',
  // companies
  companiesFetched: 'Companies fetched successfully.',
  companiesError: `Companies couldn't be fetched.`,
  companyAdded: 'Company added successfully.',
  companyUpdated: 'Company updated successfully.',
  companyDeleted: 'Company deleted successfully.',
  companyEditFailed: 'Failed to edit company.',
  companyNotFound: 'Company not found.',
  companyAddFailed: 'Failed to add company.',
  companyDeleteFailed: 'Failed to delete company.',
  // users
  usersFetched: 'Users fetched successfully.',
  usersError: `Users couldn't be fetched.`,
  userAdded: 'User added successfully.',
  userUpdated: 'User updated successfully.',
  userDeleted: 'User deleted successfully.',
  userEditFailed: 'Failed to edit user.',
  userNotFound: 'User not found.',
  userAddFailed: 'Failed to add user.',
  userDeleteFailed: 'Failed to delete user.',
}
