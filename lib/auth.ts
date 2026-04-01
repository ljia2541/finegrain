import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getServerSession } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/', // 登录后跳转首页（前端弹窗模式，不跳转）
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 首次登录，把 Google 用户信息存入 token
      if (account && profile) {
        token.id = profile.sub
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      // 把 token 中的信息暴露给前端 session
      if (session.user) {
        session.user.id = token.id as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// 服务端获取 session 的快捷方法
export const getAuthSession = () => getServerSession(authOptions)
