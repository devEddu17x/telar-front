'use client'

import { ApiError, apiRequest } from '@/lib/api/client'
import { getClientIdToken } from '@/modules/auth/lib/session-client'
import type { ActionResponse } from '@/modules/auth/types'

import { EMPLOYEE_ERRORS } from '../constants'
import { createEmployeeSchema, type CreateEmployeeInput } from '../schemas'
import type { CreateEmployeeResponse } from '../types'

function getEmployeeErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return EMPLOYEE_ERRORS.UNKNOWN
  }

  if (error.status === 409) {
    return EMPLOYEE_ERRORS.EMAIL_ALREADY_EXISTS
  }

  return error.message || EMPLOYEE_ERRORS.UNKNOWN
}

export async function createEmployeeClient(
  input: CreateEmployeeInput
): Promise<ActionResponse<CreateEmployeeResponse>> {
  const validated = createEmployeeSchema.safeParse(input)

  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || EMPLOYEE_ERRORS.UNKNOWN
    }
  }

  const idToken = getClientIdToken()

  if (!idToken) {
    return { success: false, error: 'No session' }
  }

  try {
    const data = await apiRequest<CreateEmployeeResponse>('/admin/employees', {
      method: 'POST',
      token: idToken,
      body: validated.data
    })

    return { success: true, data }
  } catch (error) {
    console.error('Create employee error:', error)
    return {
      success: false,
      error: getEmployeeErrorMessage(error)
    }
  }
}
