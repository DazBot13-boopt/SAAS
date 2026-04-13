import type { Metadata } from 'next';

type LinkCastData = {
  slug: string;
  imageUrl: string;
  targetUrl: string;
};

async function getLinkCast(slug: string): Promise<LinkCastData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/link-cast/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const linkCast = await getLinkCast(params.slug);
  const image = linkCast?.imageUrl || '';
  return {
    title: 'Click to view',
    description: 'Click to view',
    openGraph: {
      title: 'Click to view',
      images: image ? [{ url: image }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Click to view',
      images: image ? [image] : []
    }
  };
}

export default async function LinkCastPreviewPage({ params }: { params: { slug: string } }) {
  const linkCast = await getLinkCast(params.slug);

  if (!linkCast) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Lien introuvable
      </div>
    );
  }

  const safeTarget = linkCast.targetUrl.replace(/"/g, '%22');

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <img
        src={linkCast.imageUrl}
        alt="preview"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){ window.location.href = "${safeTarget}"; }, 500);`
        }}
      />
    </div>
  );
}
