import { makeId } from '../util.service'
import { storageService } from '../storage.service'

const DB_NAME = 'companiesDB'

export const companiesService = {
  getCompanies,
  saveCompany,
  deleteCompany,
  getDefaultFilter,
  getEmptyCompany,
}

async function getCompanies() {
  let companies = storageService.get(DB_NAME)

  // returning date from local storage if exists
  if (companies && companies.length) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(_refactorCompanies(companies))
      }, 1000)
    })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(DB_NAME, JSON.stringify(demoCompanies))
      resolve(_refactorCompanies(demoCompanies))
    }, 1000)
  })
}

async function saveCompany(company) {
  const companies = storageService.get(DB_NAME)
  let factoredCompany
  if (company.id) {
    factoredCompany = _factorCompanyForSave(company)
    const idx = companies.findIndex((c) => c.company_id === company.id)
    companies[idx] = {
      ...companies[idx],
      ...factoredCompany,
    }
  } else {
    factoredCompany = _factorCompanyForSave(company)
    companies.push({ ...factoredCompany })
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      storageService.set(DB_NAME, companies)
      resolve(companies)
    }, 1000)
  })
}

function deleteCompany(id) {
  const companies = storageService.get(DB_NAME)
  const idx = companies.findIndex((c) => c.company_id === id)
  if (idx === -1) return Promise.reject(new Error('Company not found'))

  return new Promise((resolve) => {
    setTimeout(() => {
      companies.splice(idx, 1)
      storageService.set(DB_NAME, companies)
      resolve(companies)
    }, 1000)
  })
}

function _refactorCompanies(companies) {
  // @CR: Consider using a more standardized approach like a mapper class or function
  // Current implementation requires maintaining two separate data structures
  return companies.map((company) => ({
    id: company.company_id,
    active: company.active,
    name: company.company_name,
    legalName: company.company_legal_name,
    country: company.country,
    dateAdded: company.date_added,
    isDpfFound: company.dpf_found,
    parentId: company.parent_id,
    providesAiServices: company.provides_ai_services,
  }))
}

function _factorCompanyForSave(company) {
  // @CR: Same issue as above - maintaining two data structures increases chance of errors
  return {
    company_id: company.id || makeId(),
    active: company.active,
    company_name: company.name,
    company_legal_name: company.legalName,
    country: company.country,
    date_added: company.dateAdded,
    dpf_found: company.isDpfFound,
    parent_id: company.parentId,
    provides_ai_services: company.providesAiServices,
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    country: '',
    onlyActive: false,
    onlyAI: false,
    onlyDPF: false,
    sortDir: 1,
  }
}

function getEmptyCompany() {
  return {
    id: makeId(),
    active: true,
    name: '',
    legalName: '',
    country: '',
    dateAdded: new Date().toISOString(),
    isDpfFound: false,
    parentId: null,
    providesAiServices: false,
    isEmpty: true,
  }
}

// Raw company data
// "active": true,
// "company_id": "pAuC6RQ71bBG",
// "company_legal_name": "Market Data Insights LLC",
// "company_name": "Market Data Insights LLC",
// "country": "USA",
// "date_added": "Sun, 26 Jan 2025 16:54:36 GMT",
// "dpf_found": false,
// "parent_id": "hDQkIp9PldZO",
// "provides_ai_services": true

var demoCompanies = [
  {
    active: true,
    company_id: 'pAuC6RQ71bBG',
    company_legal_name: 'Market Data Insights LLC',
    company_name: 'Market Data Insights LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: false,
    parent_id: 'hDQkIp9PldZO',
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'sL4O0q46zTGJ',
    company_legal_name: 'TreSensa Technologies, Inc.',
    company_name: 'TreSensa Technologies, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'aRxlTZVm6Kr3',
    company_legal_name: 'Trialize Inc.',
    company_name: 'Trialize Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:35 GMT',
    dpf_found: false,
    parent_id: 'nm5sbfa3H1AU',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'hQPRqF23sFWr',
    company_legal_name: 'Zimmer Biomet Holdings, Inc.',
    company_name: 'Zimmer Biomet',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:38:24 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'zS5p8AZDKHAy',
    company_legal_name: 'Priory Solutions LLC',
    company_name: 'Priory Solutions LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: false,
    parent_id: 'hDQkIp9PldZO',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'hDQkIp9PldZO',
    company_legal_name: 'TRGRP, Inc.',
    company_name: 'TRGRP, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'nOLii2vnnMTf',
    company_legal_name: 'Treno, Inc.',
    company_name: 'Treno',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'tAx3qMDrjrZi',
    company_legal_name: 'Trendline Interactive Holdings, LLC',
    company_name: 'Trendline Interactive Holdings, LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'dKhnUGcBrp3s',
    company_legal_name: 'ZipHQ, Inc.',
    company_name: 'ZipHQ, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:37:59 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'g2pvCB3qIzRs',
    company_legal_name: 'ZipGrade LLC',
    company_name: 'ZipGrade LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:38:00 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'wHcoH1EfthBT',
    company_legal_name: 'Zywave, Inc.',
    company_name: 'Zywave, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:41 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'j004dr5oc4HX',
    company_legal_name: 'Zyper Inc',
    company_name: 'Zyper Inc',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:42 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'wZ7fnSNyny8U',
    company_legal_name: 'Zynga Inc.',
    company_name: 'Zynga',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'q5xRMZERwO6M',
    company_legal_name: "Town's End Studios LLC",
    company_name: "Town's End Studios LLC",
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'kIBhSOdMH8US',
    company_legal_name: 'Rising Tide Games, Inc.',
    company_name: 'Rising Tide Games, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'fJitPwzxnaEo',
    company_legal_name: 'PuzzleSocial, Inc.',
    company_name: 'PuzzleSocial, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'wbqvkyXHLl08',
    company_legal_name: 'Spooky Cool Labs LLC',
    company_name: 'Spooky Cool Labs LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'oT0ypIGOe79c',
    company_legal_name: 'Zylo',
    company_name: 'Zylo',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'dBXlnpbGPpZ9',
    company_legal_name: 'Zwift, Inc',
    company_name: 'Zwift, Inc',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:45 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'iT33B4uGCTqX',
    company_legal_name: 'Leeyo Software Inc.',
    company_name: 'Leeyo Software Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:45 GMT',
    dpf_found: false,
    parent_id: 'oiGMSMk2vNhr',
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'sRqeq5uVVJHA',
    company_legal_name: 'Zephr US Inc.',
    company_name: 'Zephr US Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:46 GMT',
    dpf_found: false,
    parent_id: 'oiGMSMk2vNhr',
    provides_ai_services: true,
  },
]
