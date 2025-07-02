export default {
  theme: {
    extend: {
      colors: {
        accent: '#3b82f6', // bạn có thể chọn màu phù hợp
      },
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/tailwind-config/**/*.{js,ts,jsx,tsx,mdx}",
  ]
}