import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'finsage-finance-app-poj28z2b',
  authRequired: true
})

export default blink