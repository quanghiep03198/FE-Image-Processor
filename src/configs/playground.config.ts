import type { PreviewParams } from '@/hooks/use-image-preview'

export type SliderConfig = {
  key: keyof PreviewParams
  label: string
  group: 'Basic Adjustments' | 'Advanced Adjustments' | 'Output Quality'
  min: number
  max: number
  step: number
  description: string
}

type BasicSliderConfig = Omit<SliderConfig, 'key'> & { key: Exclude<keyof PreviewParams, 'histogram'> }

export const BASIC_SLIDER_CONFIGS: BasicSliderConfig[] = [
  {
    key: 'brightness',
    label: 'Brightness',
    group: 'Basic Adjustments',
    min: -1,
    max: 1,
    step: 0.01,
    description:
      'Adjust the brightness level to make the image lighter or darker. Increasing brightness can help reveal details in dark areas, while decreasing it can reduce overexposure in bright areas.',
  },
  {
    key: 'grayscale',
    label: 'Grayscale',
    group: 'Basic Adjustments',
    min: 0,
    max: 1,
    step: 0.01,
    description:
      'Convert the image to grayscale by adjusting the intensity of the colors. A value of 0 will keep the original colors, while a value of 1 will convert the image to complete grayscale.',
  },
  {
    key: 'gaussian_blur',
    label: 'Gaussian Blur',
    group: 'Advanced Adjustments',
    min: 0,
    max: 3,
    step: 0.01,
    description:
      'Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail.',
  },
  {
    key: 'median_blur',
    label: 'Median Blur',
    group: 'Advanced Adjustments',
    min: 0,
    max: 3,
    step: 0.01,
    description:
      'Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail.',
  },
  {
    key: 'bilateral_blur',
    label: 'Bilateral Blur',
    group: 'Advanced Adjustments',
    min: 0,
    max: 3,
    step: 0.01,
    description:
      'Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail.',
  },
  {
    key: 'denoise',
    label: 'Denoise',
    group: 'Advanced Adjustments',
    min: 0,
    max: 5,
    step: 0.01,
    description:
      'Reduce the amount of noise in the image, which can help improve the overall quality and clarity. Increasing the denoise level can help smooth out grainy or pixelated areas, but be careful not to overdo it, as it can also lead to a loss of detail.',
  },
  {
    key: 'contrast_bias',
    label: 'Contrast',
    group: 'Basic Adjustments',
    min: -0.8,
    max: 1.5,
    step: 0.01,
    description:
      'Adjust the contrast bias to enhance or reduce the contrast in the image. Increasing the contrast bias can make the dark areas darker and the bright areas brighter, while decreasing it can create a more muted and softer look.',
  },
  {
    key: 'threshold',
    label: 'Threshold',
    group: 'Advanced Adjustments',
    min: 0,
    max: 1,
    step: 0.01,
    description:
      'Adjust the threshold level to convert the image into a binary black-and-white image. Increasing the threshold will result in more areas being converted to black, while decreasing it will result in more areas being converted to white.',
  },
  {
    key: 'log_transform',
    label: 'Log Transform',
    group: 'Advanced Adjustments',
    min: 0,
    max: 1,
    step: 0.01,
    description:
      'Apply a logarithmic transformation to the image, which can help enhance details in the darker regions while compressing the brighter areas. Increasing the log transform level can make the dark areas more visible, but be cautious as it may also reduce the visibility of details in the bright areas.',
  },
  {
    key: 'sharpen',
    label: 'Sharpen',
    group: 'Advanced Adjustments',
    min: 0,
    max: 10,
    step: 0.01,
    description:
      'Enhance the edges and details in the image to make it appear sharper. Increasing the sharpen level can help bring out fine details and textures, but be careful not to overdo it, as it can also introduce noise and artifacts.',
  },
  {
    key: 'power_law',
    label: 'Power Law',
    group: 'Advanced Adjustments',
    min: 0,
    max: 3,
    step: 0.05,
    description:
      'Apply a power-law (gamma) transformation to the image, which can help adjust the overall brightness and contrast. Increasing the power law level can brighten the image and enhance details in the shadows, while decreasing it can darken the image and enhance details in the highlights.',
  },
  {
    key: 'webp_quality',
    label: 'Quality',
    group: 'Output Quality',
    min: 1,
    max: 100,
    step: 1,
    description:
      'Controls the output compression quality. Higher values preserve more detail but increase file size, while lower values reduce file size at the cost of image quality.',
  },
]
