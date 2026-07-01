import Head from "next/head";

const SITE_NAME = "Aicyro";
const DEFAULT_TITLE = "Aicyro | Stop Losing Leads";
const DEFAULT_DESCRIPTION =
  "You're not lacking leads — you're losing them. We install a 24/7 lead capture system.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
const DEFAULT_KEYWORDS =
  "lead capture, AI chatbot, lead generation, 24/7 leads, Aicyro, business automation";
const DEFAULT_FAVICON = "/icon.png"; // Added default favicon path

function resolveUrl(path, siteUrl) {
  if (!path) return siteUrl;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return siteUrl ? `${siteUrl}${normalized}` : normalized;
}

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  url,
  type = "website",
  keywords = DEFAULT_KEYWORDS,
  noindex = false,
  siteName = SITE_NAME,
  favicon = DEFAULT_FAVICON, // Added to props
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const pageUrl = resolveUrl(url, siteUrl);
  const imageUrl = resolveUrl(ogImage, siteUrl);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteName} />

      {/* --- Favicons --- */}
      <link rel="icon" href={favicon} />
      {/* Optional: Add a high-res icon for iOS home screens */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {pageUrl && <link rel="canonical" href={pageUrl} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />
    </Head>
  );
}
