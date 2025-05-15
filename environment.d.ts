declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NODE_ENV: 'development' | 'production'
      SUPABASE_PROJECT_REF: string
      SUPABASE_SERVICE_ROLE_KEY: string
    }
  }
}

export {}
