// Utility to get Storyblok token in both server and client contexts
export function getStoryblokToken(requestEvent?: {
  env: { get: (key: string) => string | undefined };
}): string | undefined {
  // In server context (routeLoader$, routeAction$), use requestEvent.env
  if (requestEvent) {
    return requestEvent.env.get("PUBLIC_STORYBLOK_TOKEN");
  }

  // In client/build context, use import.meta.env
  return import.meta.env.PUBLIC_STORYBLOK_TOKEN;
}
