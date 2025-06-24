import React from 'react'

export const SwapLoading = () => {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      className='absolute -top-[9px] -left-[9px] w-[72px] h-[72] aspect-square '
      xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_5247_395479)">
        <mask
          id="mask0_5247_395479"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="8"
          y="8"
          width="64"
          height="64">
          <path
            d="M40 9C57.1208 9 71 22.8792 71 40C71 57.1208 57.1208 71 40 71C22.8792 71 9 57.1208 9 40C9 22.8792 22.8792 9 40 9Z"
            stroke="black"
            strokeWidth="2"
          />
        </mask>
        <g mask="url(#mask0_5247_395479)">
          <circle
            cx="32"
            cy="32"
            r="32"
            fill="url(#paint0_radial_5247_395479)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_5247_395479"
          x="0"
          y="0"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.768627 0 0 0 0 0.698039 0 0 0 0 1 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5247_395479"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5247_395479"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_5247_395479"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(31.9525 31.8291) rotate(90) scale(31.5971 31.9525)">
          <stop offset="0.4" stopColor="#C4B2FF" />
          <stop offset="1" stopColor="#C4B2FF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
