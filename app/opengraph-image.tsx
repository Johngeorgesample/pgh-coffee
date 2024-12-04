import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {

  // @TODO replace this
  const response = await fetch('https://www.pgh.coffee/api/shops/Ruckus%20Cafe_Shaler', {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch shop data')
  }

  const data = await response.json()

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fde047',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {data.properties.name || 'pgh.coffee'}
          </div>
          <div
            style={{
              fontSize: 48,
              marginBottom: '20px',
            }}
          >
            {data.properties.neighborhood}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: '10px 20px',
              borderRadius: '9999px',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 250 250">
              <path
                fill="#000000"
                d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z"
              />
            </svg>
            <div
              style={{
                fontSize: 24,
                marginLeft: 10,
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
      ...size,
    },
  )
}
