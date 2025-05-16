declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TESTNET_NODE_URL: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}
