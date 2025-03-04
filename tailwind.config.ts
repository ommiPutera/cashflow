import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xs: ["12.5px", "18px"],
        sm: ["13.5px", "20px"],
        base: ["15px", "24px"],
        lg: ["19.5px", "28px"],
        xl: ["23px", "31px"],
        "2xl": ["28px", "34.5px"],
        "3xl": ["33px", "36.5px"],
        "4xl": ["38px", "40px"],
        "5xl": ["54px", "1.1em"],
      },
      maxWidth: {
        xs: "21rem",
      },
      colors: {
        white: "hsl(var(--white))",
        black: "hsl(var(--black))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary-500))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "hsl(var(--primary-50))",
          "100": "hsl(var(--primary-100))",
          "200": "hsl(var(--primary-200))",
          "300": "hsl(var(--primary-300))",
          "400": "hsl(var(--primary-400))",
          "500": "hsl(var(--primary-500))",
          "600": "hsl(var(--primary-600))",
          "700": "hsl(var(--primary-700))",
          "800": "hsl(var(--primary-800))",
          "900": "hsl(var(--primary-900))",
        },
        success: {
          DEFAULT: "hsl(var(--success-500))",
          "50": "hsl(var(--success-50))",
          "100": "hsl(var(--success-100))",
          "200": "hsl(var(--success-200))",
          "300": "hsl(var(--success-300))",
          "400": "hsl(var(--success-400))",
          "500": "hsl(var(--success-500))",
          "600": "hsl(var(--success-600))",
          "700": "hsl(var(--success-700))",
          "800": "hsl(var(--success-800))",
          "900": "hsl(var(--success-900))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning-500))",
          "50": "hsl(var(--warning-50))",
          "100": "hsl(var(--warning-100))",
          "200": "hsl(var(--warning-200))",
          "300": "hsl(var(--warning-300))",
          "400": "hsl(var(--warning-400))",
          "500": "hsl(var(--warning-500))",
          "600": "hsl(var(--warning-600))",
          "700": "hsl(var(--warning-700))",
          "800": "hsl(var(--warning-800))",
          "900": "hsl(var(--warning-900))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger-500))",
          "50": "hsl(var(--danger-50))",
          "100": "hsl(var(--danger-100))",
          "200": "hsl(var(--danger-200))",
          "300": "hsl(var(--danger-300))",
          "400": "hsl(var(--danger-400))",
          "500": "hsl(var(--danger-500))",
          "600": "hsl(var(--danger-600))",
          "700": "hsl(var(--danger-700))",
          "800": "hsl(var(--danger-800))",
          "900": "hsl(var(--danger-900))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
