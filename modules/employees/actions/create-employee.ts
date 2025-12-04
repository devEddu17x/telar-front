'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { EMPLOYEE_ERRORS } from '../constants'
import { createEmployeeSchema } from '../schemas'
import type { CreateEmployeeResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createEmployee(
  _prevState: ActionResponse<CreateEmployeeResponse>,
  formData: FormData
): Promise<ActionResponse<CreateEmployeeResponse>> {
  const rawData = {
    names: formData.get('names'),
    lastNames: formData.get('lastNames'),
    email: formData.get('email'),
    password: formData.get('password')
  }

  const validatedFields = createEmployeeSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || EMPLOYEE_ERRORS.UNKNOWN
    }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/admin/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify(validatedFields.data)
    })

    if (response.status === 409) {
      return {
        success: false,
        error: EMPLOYEE_ERRORS.EMAIL_ALREADY_EXISTS
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: EMPLOYEE_ERRORS.UNKNOWN
      }
    }

    const data: CreateEmployeeResponse = await response.json()

    revalidatePath('/admin/employees')

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Create employee error:', error)
    return {
      success: false,
      error: EMPLOYEE_ERRORS.UNKNOWN
    }
  }
}
