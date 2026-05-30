import { ThemeKey, themeToCssVars } from "./themes";

export const suggestions = [
  {
    icon: "✈️",
    name: "Travel Planner App",
    description: "Plan trips with itineraries, maps, and budget tracking",
  },
  {
    icon: "🤖",
    name: "AI Learning Platform",
    description: "Personalized courses and quizzes powered by AI",
  },
  {
    icon: "💰",
    name: "Finance Tracker",
    description: "Monitor expenses, budgets, and savings goals",
  },
  {
    icon: "🛍️",
    name: "E-Commerce Store",
    description: "Browse, cart, and checkout with a modern shopping experience",
  },
  {
    icon: "✅",
    name: "Smart To-Do Planner",
    description: "Organize tasks with priorities, deadlines, and reminders",
  },
  {
    icon: "🍔",
    name: "Food Delivery App",
    description: "Order meals from local restaurants with real-time tracking",
  },
  {
    icon: "🎨",
    name: "Kids Learning App",
    description: "Fun and interactive lessons for children through games",
  },
];

const PROXY_IMAGE_HOSTS = ["i.pravatar.cc"];

export const proxyExternalImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !PROXY_IMAGE_HOSTS.includes(parsed.hostname)) {
      return url;
    }
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
};

const proxyExternalImagesInHtml = (htmlCode: string) =>
  htmlCode.replace(
    /(<img\b[^>]*\bsrc=)(["'])(https?:\/\/[^"']+)\2/gi,
    (_, prefix, quote, url) => `${prefix}${quote}${proxyExternalImageUrl(url)}${quote}`
  );

export const HtmlWrapper = (theme: any, htmlCode: string) => {
  const proxiedHtml = proxyExternalImagesInHtml(htmlCode ?? "");
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
      <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  
  
  <!-- Tailwind + Iconify -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
    <style>
      ${themeToCssVars(theme)}
      *, *::before, *::after {
        scrollbar-width: none;        /* Firefox */
        -ms-overflow-style: none;     /* IE/Edge */
      }
      *::-webkit-scrollbar {
        display: none;                /* Chrome/Safari */
      }
    </style>
  </head>
  <body class="bg-[var(--background)] text-[var(--foreground)] w-full overflow-x-hidden">
    ${proxiedHtml}
  </body>
  </html>
  `;
}