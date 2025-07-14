import { countries } from './useCompanyFilter'

export const companyFields = [
  { key: 'name', label: 'Company Name', type: 'text', aiSuggest: true },
  { key: 'legalName', label: 'Legal Name', type: 'text' },
  { key: 'country', label: 'Country', type: 'select', options: countries },
  { key: 'parentName', label: 'Parent Company', type: 'select', options: [] },
  { key: 'active', label: 'Active', type: 'checkbox' },
  { key: 'providesAiServices', label: 'Provides AI Services', type: 'checkbox' },
  { key: 'isDpfFound', label: 'DPF Found', type: 'checkbox' },
  { key: 'dateAdded', label: 'Created At', type: 'date' },
]
