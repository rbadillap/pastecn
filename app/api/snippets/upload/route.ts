import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { head, BlobNotFoundError } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Extract ID from pathname: "snippets/{id}.json"
        const id = pathname.replace('snippets/', '').replace('.json', '')
        
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
          throw error // Re-throw other errors
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: future metadata storage
      },
    })
    
    return NextResponse.json(jsonResponse)
  } catch (error) {
    if (error instanceof Error && error.message === 'ID_COLLISION') {
      return NextResponse.json(
        { error: 'ID collision - blob already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
