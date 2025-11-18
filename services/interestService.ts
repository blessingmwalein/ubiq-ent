import apiClient from '@/lib/api-client'

export interface Interest {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface InterestsResponse {
  data: Record<string, Interest[]>
}

export interface CompleteOnboardingData {
  avatar_url?: string
  date_of_birth?: string
  phone_number?: string
  country_code?: string
  interests: number[] // Array of interest IDs (integers)
}

class InterestService {
  async getInterests(): Promise<InterestsResponse> {
    const response = await apiClient.get('/interests')
    return response.data
  }

  async completeOnboarding(data: CompleteOnboardingData) {
    const response = await apiClient.post('/onboarding/complete', data)
    return response.data
  }
}

export default new InterestService()
