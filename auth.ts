import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { writeClient } from "@/sanity/lib/write-client";
import { isSanityConfigured } from "@/sanity/env";

/**
 * The Sanity author _id is deterministic (`author-<github id>`), so the
 * session can carry it without an extra lookup on every request.
 */
export const authorIdFor = (githubId: string | number) => `author-${githubId}`;

/** auth() that returns null instead of throwing when auth env is missing. */
export const safeAuth = async () => {
  try {
    const session = await auth();
    return session?.user ? session : null;
  } catch {
    return null;
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.id || !isSanityConfigured) return true;

      try {
        await writeClient.createIfNotExists({
          _id: authorIdFor(profile.id as string | number),
          _type: "author",
          id: Number(profile.id),
          name: user.name ?? (profile.login as string) ?? "Founder",
          username: (profile.login as string) ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          bio: (profile.bio as string) ?? "",
        });
      } catch (error) {
        console.error("Could not sync author to Sanity:", error);
      }

      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.authorId = authorIdFor(profile.id as string | number);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.authorId) {
        Object.assign(session, { authorId: token.authorId });
      }
      return session;
    },
  },
});
