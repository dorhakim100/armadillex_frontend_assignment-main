import { makeId } from '../util.service'
import { storageService } from '../storage.service'

const DB_NAME = 'usersDB'

export const usersService = {
  getUsers,
  saveUser,
  deleteUser,
  getDefaultFilter,
  getEmptyUser,
}

async function getUsers() {
  let users = storageService.get(DB_NAME)

  // returning date from local storage if exists
  if (users && users.length) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(_refactorUsers(users))
      }, 1000)
    })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(DB_NAME, JSON.stringify(demoUsers))
      resolve(_refactorUsers(demoUsers))
    }, 1000)
  })
}

async function saveUser(user) {
  const users = storageService.get(DB_NAME)
  let factoredUser
  if (user.id) {
    factoredUser = _factorUserForSave(user)
    const idx = users.findIndex((u) => u.user_id === user.id)
    users[idx] = {
      ...users[idx],
      ...factoredUser,
    }
  } else {
    factoredUser = _factorUserForSave(user)
    users.push({ ...factoredUser })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      storageService.set(DB_NAME, users)
      resolve(users)
    }, 1000)
  })
}

function deleteUser(id) {
  const users = storageService.get(DB_NAME)
  const idx = users.findIndex((u) => u.user_id === id)
  if (idx === -1) return Promise.reject(new Error('User not found'))

  return new Promise((resolve) => {
    setTimeout(() => {
      users.splice(idx, 1)
      storageService.set(DB_NAME, users)
      resolve(users)
    }, 1000)
  })
}

function _refactorUsers(users) {
  // @CR: Consider using a more standardized approach like a mapper class or function
  // Current implementation requires maintaining two separate data structures
  return users.map((user) => ({
    id: user.user_id,
    active: user.active,
    fullname: user.fullname,
    email: user.email,
    country: user.country,
    dateAdded: user.date_added,
    departmentId: user.department_id,
    isAdmin: user.is_admin,
  }))
}

function _factorUserForSave(user) {
  // @CR: Same issue as above - maintaining two data structures increases chance of errors
  return {
    user_id: user.id || makeId(),
    active: user.active,
    fullname: user.fullname,
    email: user.email,
    country: user.country,
    date_added: user.dateAdded,
    department_id: user.departmentId,
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    country: '',
    onlyActive: false,
    onlyAdmin: false,
    onlyVerified: false,
    sortDir: 1,
  }
}

function getEmptyUser() {
  return {
    id: makeId(),
    active: true,
    fullname: '',
    email: '',
    country: '',
    dateAdded: new Date().toISOString(),
    departmentId: null,
    isAdmin: false,
    isEmpty: true,
  }
}

// Raw user data
// "active": true,
// "user_id": "pAuC6RQ71bBG",
// "first_name": "John",
// "last_name": "Doe",
// "email": "john.doe@example.com",
// "country": "USA",
// "date_added": "Sun, 26 Jan 2025 16:54:36 GMT",
// "is_verified": true,
// "department_id": "hDQkIp9PldZO",
// "is_admin": false

var demoUsers = [
  {
    active: true,
    user_id: 'pAuC6RQ71bBG',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    department_id: 'hDQkIp9PldZO',
    is_admin: true,
  },
  {
    active: true,
    user_id: 'pAuC6RQ75bBG',
    fullname: 'John Foe',
    email: 'john.doe@example.com',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    department_id: 'hDQkIp9PldZO',
    is_admin: false,
  },
  {
    active: true,
    user_id: 'pAuC6RQ72bBG',
    fullname: 'John Soe',
    email: 'john.doe@example.com',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    department_id: 'hDQkIp9PldZO',
    is_admin: false,
  },
]
