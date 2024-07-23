import { Expander, Flex, StandaloneAccordion } from '@invoke-ai/ui-library';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { useAppSelector } from 'app/store/storeHooks';
import ParamCreativity from 'features/parameters/components/Upscale/ParamCreativity';
import ParamSharpness from 'features/parameters/components/Upscale/ParamSharpness';
import ParamSpandrelModel from 'features/parameters/components/Upscale/ParamSpandrelModel';
import ParamStructure from 'features/parameters/components/Upscale/ParamStructure';
import { selectUpscalelice } from 'features/parameters/store/upscaleSlice';
import { UpscaleScaleSlider } from 'features/settingsAccordions/components/UpscaleSettingsAccordion/UpscaleScaleSlider';
import { useExpanderToggle } from 'features/settingsAccordions/hooks/useExpanderToggle';
import { useStandaloneAccordionToggle } from 'features/settingsAccordions/hooks/useStandaloneAccordionToggle';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { MultidiffusionWarning } from './MultidiffusionWarning';
import { UpscaleInitialImage } from './UpscaleInitialImage';

const selector = createMemoizedSelector([selectUpscalelice], (upscaleSlice) => {
  const { upscaleModel, upscaleInitialImage, scale } = upscaleSlice;

  const badges: string[] = [];

  if (upscaleModel) {
    badges.push(upscaleModel.name);
  }

  if (upscaleInitialImage) {
    // Output height and width are scaled and rounded down to the nearest multiple of 8
    const outputWidth = Math.floor((upscaleInitialImage.width * scale) / 8) * 8;
    const outputHeight = Math.floor((upscaleInitialImage.height * scale) / 8) * 8;

    badges.push(`${outputWidth}×${outputHeight}`);
  }

  return { badges };
});

export const UpscaleSettingsAccordion = memo(() => {
  const { t } = useTranslation();
  const { badges } = useAppSelector(selector);
  const { isOpen: isOpenAccordion, onToggle: onToggleAccordion } = useStandaloneAccordionToggle({
    id: 'upscale-settings',
    defaultIsOpen: true,
  });

  const { isOpen: isOpenExpander, onToggle: onToggleExpander } = useExpanderToggle({
    id: 'upscale-settings-advanced',
    defaultIsOpen: false,
  });

  return (
    <StandaloneAccordion label="Upscale" badges={badges} isOpen={isOpenAccordion} onToggle={onToggleAccordion}>
      <Flex pt={4} px={4} w="full" h="full" flexDir="column" data-testid="image-settings-accordion">
        <Flex gap={4}>
          <UpscaleInitialImage />
          <Flex direction="column" w="full" alignItems="center" gap={2}>
            <ParamSpandrelModel />
            <UpscaleScaleSlider />
            <MultidiffusionWarning />
          </Flex>
        </Flex>
        <Expander label={t('accordions.advanced.options')} isOpen={isOpenExpander} onToggle={onToggleExpander}>
          <Flex gap={4} pb={4} flexDir="column">
            <ParamSharpness />
            <ParamCreativity />
            <ParamStructure />
          </Flex>
        </Expander>
      </Flex>
    </StandaloneAccordion>
  );
});

UpscaleSettingsAccordion.displayName = 'UpscaleSettingsAccordion';