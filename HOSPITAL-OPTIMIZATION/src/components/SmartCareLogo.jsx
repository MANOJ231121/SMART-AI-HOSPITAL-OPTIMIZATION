import React from 'react';

/**
 * SmartCare Brand Logo component matching the official blue gradient rounded badge
 * with a crisp white heart containing a heartbeat ECG pulse waveform.
 */
export default function SmartCareLogo({ size = 38, className = '', style = {} }) {
  const iconSize = Math.round(size * 0.58);
  const borderRadius = Math.round(size * 0.28);

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 shadow-md ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566z"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 12.2h5l2-3.8 3.5 7.6 2.5-4.8 2 1.8h4"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
