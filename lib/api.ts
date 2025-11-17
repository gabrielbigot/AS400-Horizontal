export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  user_id?: string
  company_id?: string
}

export interface ChatResponse {
  success: boolean
  message: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
  iterations?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function sendChatMessage(
  message: string,
  companyId: string = 'default'
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        company_id: companyId,
      } as ChatRequest),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    return data.message
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    console.error('Error testing connection:', error)
    return false
  }
}
