import React from 'react';

function PaymentSuccessInner({ amount }: { amount: string }) {
    return (
      <main
        style={{
          maxWidth: '48rem',
          margin: '2.5rem auto',
          padding: '2.5rem',
          textAlign: 'center',
          color: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to bottom right, #4f46e5, #9333ea, #ec4899)'
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Thank you!
          </h1>
          <h2 style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Your Order Was Successful
          </h2>
          <div
            style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1.25rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#9333ea',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            ${amount}
          </div>
        </div>
      </main>
    );
}

export default PaymentSuccessInner;
