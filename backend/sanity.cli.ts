import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7tl85h8u',
    dataset: 'production'
  },
  deployment: {
    appId: 'mpy2f8k2zn0svr02w1enoc2r',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
