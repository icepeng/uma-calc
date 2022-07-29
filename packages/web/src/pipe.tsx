import { Box, Image } from '@chakra-ui/react';

export function renderType(type?: string) {
  if (
    !type ||
    [
      'speed',
      'stamina',
      'power',
      'guts',
      'intelligence',
      'friend',
      'group',
    ].includes(type) === false
  ) {
    return '';
  }
  return (
    <Box position={'absolute'} top={'-3px'} right={'-3px'}>
      <Image
        boxSize={'35px'}
        src={`/img/icons/${type}_support_icon.png`}
        alt={`${type}_support_icon.png`}
      ></Image>
    </Box>
  );
}

export function handleNumber(value: number | string, fallbackValue = 0) {
  const num = +value;
  if (isNaN(num)) {
    return fallbackValue;
  }
  return num;
}
