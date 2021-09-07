import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import * as NextImage from 'next/image'
import React from 'react'
import { RefreshProvider } from '../src/contexts/RefreshContext'

const OriginalNextImage = NextImage.default
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
})

export const parameters = {
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
}

export const decorators = [
  (Story) => (
    <RefreshProvider>
      <div className="w-full p-4 bg-scaffold">
        <Story />
      </div>
    </RefreshProvider>
  ),
]
