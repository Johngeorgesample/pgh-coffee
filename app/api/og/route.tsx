import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const COFFEE_ICON_SVG = (
  <svg width="48" height="48" viewBox="0 0 250 250">
    <path
      fill="#000000"
      d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
    />
  </svg>
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const shop = searchParams.get('shop')

    // If no shop parameter, return default branded image
    if (!shop) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fde047',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              pgh.coffee
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {COFFEE_ICON_SVG}
            </div>
            <div
              style={{
                fontSize: 32,
                marginTop: '20px',
              }}
            >
              A guide to coffee in Pittsburgh, PA
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }

    // Fetch shop data
    const baseUrl = request.nextUrl.origin
    const shopResponse = await fetch(`${baseUrl}/api/shops/${encodeURIComponent(shop)}`, {
      cache: 'no-store',
    })

    if (!shopResponse.ok) {
      // Return fallback branded image for invalid shop
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fde047',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                marginBottom: '20px',
              }}
            >
              pgh.coffee
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {COFFEE_ICON_SVG}
            </div>
            <div
              style={{
                fontSize: 28,
                marginTop: '20px',
              }}
            >
              Coffee shops in Pittsburgh, PA
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }

    const shopData = await shopResponse.json()
    const { name, neighborhood, photo } = shopData.properties

    // If shop has a photo, use split layout
    if (photo) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              backgroundColor: '#fde047',
            }}
          >
            {/* Left side: Shop photo */}
            <div
              style={{
                width: '50%',
                height: '100%',
                display: 'flex',
              }}
            >
              <img
                src={photo}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Right side: Shop info */}
            <div
              style={{
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  marginBottom: '16px',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: 36,
                  marginBottom: '40px',
                  textAlign: 'center',
                }}
              >
                {neighborhood}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                }}
              >
                {COFFEE_ICON_SVG}
                <div
                  style={{
                    fontSize: 28,
                    marginLeft: 12,
                    fontWeight: 600,
                  }}
                >
                  pgh.coffee
                </div>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }

    // Fallback: Text-only layout for shops without photos
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fde047',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              marginBottom: '12px',
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 48,
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            {neighborhood}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: '12px 24px',
              borderRadius: '9999px',
            }}
          >
            {COFFEE_ICON_SVG}
            <div
              style={{
                fontSize: 28,
                marginLeft: 12,
                fontWeight: 600,
              }}
            >
              pgh.coffee
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    // Return generic fallback on any error
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fde047',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            pgh.coffee
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {COFFEE_ICON_SVG}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
