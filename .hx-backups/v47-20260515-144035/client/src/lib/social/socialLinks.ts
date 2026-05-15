// client/src/lib/social/socialLinks.ts
export type SocialLink = {
  id: string;
  label: string;
  href: string;
  note?: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "website", label: "Website", href: "https://TheGenuineLoveProject.com" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/" , note: "Add your handle" },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com/@", note: "Add your handle" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com/@", note: "Add your handle" },
  { id: "x", label: "X (Twitter)", href: "https://x.com/", note: "Add your handle" },
  { id: "threads", label: "Threads", href: "https://www.threads.net/@", note: "Add your handle" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com/", note: "Add your page" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/", note: "Add your page" },
  { id: "pinterest", label: "Pinterest", href: "https://pinterest.com/", note: "Add your handle" },
  { id: "medium", label: "Medium", href: "https://medium.com/@", note: "Add your publication" },
  { id: "substack", label: "Substack", href: "https://substack.com/", note: "Add your newsletter" },
  { id: "github", label: "GitHub", href: "https://github.com/", note: "Add your org/repo" },
];