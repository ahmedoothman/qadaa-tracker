import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Qadaa Tracker - Track Your Missed Prayers & Fasts';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          background:
            'linear-gradient(135deg, #0f766e 0%, #134e4a 50%, #0d3d3a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Moon Icon */}
        <div
          style={{
            display: 'flex',
            marginBottom: 30,
          }}
        >
          <svg
            width='100'
            height='100'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 10,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Qadaa Tracker
          </div>
          <div
            style={{
              fontSize: 48,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 20,
            }}
          >
            متتبع القضاء
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Track your missed prayers & fasts with ease
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '12px 24px',
              borderRadius: 30,
              color: 'white',
              fontSize: 20,
            }}
          >
            🕌 Salah Tracker
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '12px 24px',
              borderRadius: 30,
              color: 'white',
              fontSize: 20,
            }}
          >
            🌙 Siyam Tracker
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '12px 24px',
              borderRadius: 30,
              color: 'white',
              fontSize: 20,
            }}
          >
            📊 Progress Tracking
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
