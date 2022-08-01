import { Box, Image, Center } from '@chakra-ui/react';
import { db } from '@uma-calc/core';

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
    return;
  }
  return (
    <Box position={'absolute'} top={'-5px'} right={'5px'}>
      <Image
        boxSize={'35px'}
        src={`/img/icons/${type}_support_icon.png`}
        alt={`${type}_support_icon.png`}
      ></Image>
    </Box>
  );
}

export function renderSupportCard(support_id: number, onClick?: () => void) {
  const target_card =
    db.supportCards.find((x) => x.support_id === support_id) ?? undefined;

  return (
    <Center
      position={'relative'}
      boxSize={'150px'}
      _hover={{ backgroundColor: 'gray.100' }}
      flexDirection={'column'}
      margin={[0, 'auto']}
      cursor={'pointer'}
      borderRadius={4}
      onClick={onClick}
    >
      <Image
        boxSize="128px"
        alt={support_id.toString()}
        src={`/img/supports/${support_id}.png`}
      />
      {target_card?.name_ko}
      {renderType(target_card?.type)}
    </Center>
  );
}

export function handleNumber(value: number | string, fallbackValue = 0) {
  const num = +value;
  if (isNaN(num)) {
    return fallbackValue;
  }
  return num;
}
