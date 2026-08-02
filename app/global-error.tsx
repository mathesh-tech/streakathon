"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Runtime Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'sans-serif'
        }}>
          <AlertOctagon size={64} color="#ef4444" style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Critical System Error</h1>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>A fatal error occurred that broke the application root.</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
