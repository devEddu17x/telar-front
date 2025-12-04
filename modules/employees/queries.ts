import 'server-only'

import { fetchWithAuth } from '@/lib/fetch'

import type { Employee, GetCurrentEmployeeResponse } from './types'

export async function getEmployees(): Promise<Employee[]> {
  const data = await fetchWithAuth<Employee[]>('/admin/employees')
  return data
}

export async function getCurrentEmployee(): Promise<GetCurrentEmployeeResponse> {
  const data = await fetchWithAuth<GetCurrentEmployeeResponse>('/employees/me')
  return data
}
