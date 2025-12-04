'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { EMPLOYEE_ERRORS } from '../constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function deleteEmployee(
  employeeId: string
): Promise<ActionResponse> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/admin/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      }
    })

    if (response.status === 404) {
      return {
        success: false,
        error: EMPLOYEE_ERRORS.NOT_FOUND
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: EMPLOYEE_ERRORS.UNKNOWN
      }
    }

    revalidatePath('/admin/employees')

    return {
      success: true
    }
  } catch (error) {
    console.error('Delete employee error:', error)
    return {
      success: false,
      error: EMPLOYEE_ERRORS.UNKNOWN
    }
  }
}
