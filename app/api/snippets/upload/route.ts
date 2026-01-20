import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { head, BlobNotFoundError } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { validateSnippetId } from '@/lib/validation'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Extract ID from pathname: "snippets/{id}.json"
        const id = pathname.replace('snippets/', '').replace('.json', '')
        
        // Validate ID format
        if (!validateSnippetId(id)) {
          throw new Error('INVALID_ID')
        }
        
        // Check if blob already exists
        try {
          await head(`snippets/${id}.json`)
          // Blob exists - return 409
          throw new Error('ID_COLLISION')
        } catch (error) {
          if (error instanceof BlobNotFoundError) {
            // Blob doesn't exist - proceed with upload
            return {
              allowedContentTypes: ['application/json'],
              addRandomSuffix: false,
            }
          }
          if (error instanceof Error && error.message === 'ID_COLLISION') {
            throw error // Re-throw collision error
          }
          if (error instanceof Error && error.message === 'INVALID_ID') {
            throw error // Re-throw invalid ID error
          }
          throw error // Re-throw other errors
        }
      },
    })
    
    return NextResponse.json(jsonResponse)
  } catch (error) {
    if (error instanceof Error && error.message === 'ID_COLLISION') {
      track('upload_error', {
        error_type: 'id_collision',
        status_code: 409,
      })
      return NextResponse.json(
        { error: 'ID collision - blob already exists' },
        { status: 409 }
      )
    }
    
    if (error instanceof Error && error.message === 'INVALID_ID') {
      track('upload_error', {
        error_type: 'invalid_id',
        status_code: 400,
      })
      return NextResponse.json(
        { error: 'Invalid snippet ID format' },
        { status: 400 }
      )
    }
    
    // Detect Vercel Blob errors and return semantic status codes
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      
      if (message.includes('size') || message.includes('too large')) {
        track('upload_error', {
          error_type: 'size_limit',
          status_code: 413,
        })
        return NextResponse.json({}, { status: 413 })
      }
      
      if (message.includes('content type') || message.includes('type')) {
        track('upload_error', {
          error_type: 'content_type',
          status_code: 415,
        })
        return NextResponse.json({}, { status: 415 })
      }
      
      if (message.includes('permission') || message.includes('forbidden')) {
        track('upload_error', {
          error_type: 'permission',
          status_code: 403,
        })
        return NextResponse.json({}, { status: 403 })
      }
    }
    
    // TODO: Implement rate limiting here
    // Consider using Vercel Edge Config, Upstash Redis, or similar
    // Rate limit by IP address or user identifier
    // Suggested implementation:
    // - Check request rate for IP
    // - Return 429 Too Many Requests if exceeded
    // - Use appropriate time window (e.g., 10 requests per minute)
    
    track('upload_error', {
      error_type: 'unknown',
      status_code: 400,
    })
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
