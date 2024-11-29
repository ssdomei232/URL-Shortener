import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const BASE_URL = publicRuntimeConfig.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

