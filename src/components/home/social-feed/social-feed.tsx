import { component$ } from '@builder.io/qwik';

export interface InstagramPostProps {
  id: string;
  imageUrl: string;
  link: string;
  caption?: string;
  likes?: number;
}

export const MOCK_INSTAGRAM_POSTS: InstagramPostProps[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1542345812-d98b8cd6ec98?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Tarde de cultura y tradición en la Sociedad.',
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Celebrando nuestras raíces.',
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Encuentros que nos unen.',
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Nuestra gastronomía.',
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1559564146-5b430c513233?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Danzas tradicionales.',
  },
  {
    id: 'post-6',
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c314a85ee8?auto=format&fit=crop&q=80&w=600&h=600',
    link: '#',
    caption: 'Momentos inolvidables.',
  },
];

type SocialFeedProps = {
  posts?: InstagramPostProps[];
};

export const SocialFeed = component$<SocialFeedProps>(({ posts }) => {
  const safePosts = posts && posts.length > 0 ? posts : MOCK_INSTAGRAM_POSTS;

  return (
    <section class="relative py-20 bg-slate-900 text-white border-t border-slate-800">
      <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-green-600 via-white to-red-600" />

      <div class="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <header class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div class="text-center md:text-left">
            <p class="mb-2 text-xs font-bold tracking-[0.35em] text-green-400">
              CULTURA · FAMILIA · TRADICIÓN
            </p>
            <h2 class="text-3xl font-black uppercase leading-tight tracking-[0.25em] md:text-4xl">
              @italianosenmiramar
            </h2>
          </div>

          <a
            href="https://www.instagram.com/italianosenmiramar/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 border border-white bg-transparent text-white px-6 py-3 text-xs font-black uppercase tracking-[0.25em] transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
          >
            <span>Ver perfil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </header>

        <div class="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-2 lg:grid-cols-4 xl:grid-cols-6">
          {safePosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              class="group relative block aspect-square overflow-hidden bg-slate-800"
            >
              <img
                src={post.imageUrl}
                alt={post.caption || 'Post de Instagram de la Sociedad Italiana'}
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div class="flex flex-col items-center gap-2 text-center text-white px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mb-1 h-9 w-9"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>

                  {post.caption && (
                    <p class="text-xs font-medium line-clamp-3 opacity-90 mt-2">
                      {post.caption}
                    </p>
                  )}

                  {post.likes && (
                    <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});
