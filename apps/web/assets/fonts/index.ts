import localFont from 'next/font/local';

export const notoSans = localFont({
  src: [
    {
      path: './noto-sans/NotoSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './noto-sans/NotoSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './noto-sans/NotoSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './noto-sans/NotoSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  fallback: ['sans-serif'],
});
