import {
  Divider,
  Flex,
  forwardRef,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Select,
  SelectProps,
  SimpleGrid,
  Spacer,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Tag,
  Wrap,
} from '@chakra-ui/react';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  useForm,
} from 'react-hook-form';
import { RacingStat, 거리타입by거리 } from '@uma-calc/core';
import { useMemo } from 'react';
import calculateRacing from './../../../core/dist/racing/calculation';

const initialFormValue: RacingStat = {
  stat: {
    speed: 1200,
    stamina: 900,
    power: 750,
    guts: 400,
    intelligence: 500,
  },
  적성: {
    마장적성: {
      잔디: 'A',
      더트: 'A',
    },
    거리적성: {
      단거리: 'A',
      마일: 'A',
      중거리: 'A',
      장거리: 'A',
    },
    각질적성: {
      도주: 'A',
      선행: 'A',
      선입: 'A',
      추입: 'A',
    },
  },
  컨디션: '최상',
  작전: '선행',
  healSkills: {
    gold: 1,
    normal: 1,
    unique: 4,
    uniqueUpper: 0,
  },
  race: {
    마장: '잔디',
    마장상태: '양호',
    거리: 2400,
  },
} as const;

const RankSelect = forwardRef((props: SelectProps, ref) => {
  return (
    <Select {...props} ref={ref}>
      <option value="S">S</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
      <option value="E">E</option>
      <option value="F">F</option>
      <option value="G">G</option>
    </Select>
  );
});

const createNumberInputControl = (control: Control) => {
  const NumberInputFieldComponent = (
    props: Omit<ControllerProps, 'render' | 'control'> &
      Partial<{ numberInputProps: NumberInputProps }>
  ) => {
    return (
      <Controller
        {...props}
        render={({ field: { onChange, ...restField } }) => (
          <NumberInput
            {...restField}
            onChange={(value) => onChange(Number(value))}
            {...props.numberInputProps}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
        control={control}
      />
    );
  };

  NumberInputFieldComponent.displayName = 'NumberInputField';

  return NumberInputFieldComponent;
};

const conditions = ['최상', '양호', '보통', '저조', '최악'];
const strategies = ['도주', '선행', '선입', '추입'];
const babas = ['잔디', '더트'];
const babaStatuses = ['양호', '연중', '중', '불량'];
const distanceTypes = ['단거리', '마일', '중거리', '장거리'];
const distances = [
  ...[1000, 1200, 1400],
  ...[1500, 1600, 1800],
  ...[2000, 2200, 2300, 2400],
  ...[2500, 2600, 3000, 3200, 3400, 3600],
];

const round2 = (n: number) => Math.round(n * 100) / 100;

const RacingPage = () => {
  const methods = useForm({
    defaultValues: initialFormValue,
  });
  const { register, control, watch } = methods;

  const NumberField = useMemo(
    () =>
      createNumberInputControl(control as unknown as Control<FieldValues, any>),
    [control]
  );

  const watchValue = watch();
  const calculatedRaceStat = calculateRacing(watchValue);
  const { compensatedStat, idealSpurtStamina } = calculatedRaceStat;

  return (
    <form>
      <Stack padding={4} spacing={4} direction="row">
        <Stack
          maxW={900}
          padding={4}
          spacing={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
        >
          <Heading size={'md'} marginBottom={4}>
            스테이터스
          </Heading>
          <SimpleGrid columns={5} spacing={4}>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                스피드
              </Heading>
              <NumberField
                name="stat.speed"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 1200 }}
              />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                스테미나
              </Heading>
              <NumberField
                name="stat.stamina"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 1200 }}
              />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                파워
              </Heading>
              <NumberField
                name="stat.power"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 1200 }}
              />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                근성
              </Heading>
              <NumberField
                name="stat.guts"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 1200 }}
              />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                지능
              </Heading>
              <NumberField
                name="stat.intelligence"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 1200 }}
              />
            </Wrap>
          </SimpleGrid>
          <Divider />
          <SimpleGrid spacing={4} columns={4}>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                잔디 적성
              </Heading>
              <RankSelect {...register('적성.마장적성.잔디')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                더트 적성
              </Heading>
              <RankSelect {...register('적성.마장적성.더트')} />
            </Wrap>
            <Spacer /> <Spacer />
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                도주 적성
              </Heading>
              <RankSelect {...register('적성.각질적성.도주')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                선행 적성
              </Heading>
              <RankSelect {...register('적성.각질적성.선행')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                선입 적성
              </Heading>
              <RankSelect {...register('적성.각질적성.선입')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                추입 적성
              </Heading>
              <RankSelect {...register('적성.각질적성.추입')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                단거리 적성
              </Heading>
              <RankSelect {...register('적성.거리적성.단거리')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                마일 적성
              </Heading>
              <RankSelect {...register('적성.거리적성.마일')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                중거리 적성
              </Heading>
              <RankSelect {...register('적성.거리적성.중거리')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                장거리 적성
              </Heading>
              <RankSelect {...register('적성.거리적성.장거리')} />
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                컨디션
              </Heading>
              <Select {...register('컨디션')}>
                {conditions.map((condition) => (
                  <option value={condition}>{condition}</option>
                ))}
              </Select>
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                작전
              </Heading>
              <Select {...register('작전')}>
                {strategies.map((strategy) => (
                  <option value={strategy}>{strategy}</option>
                ))}
              </Select>
            </Wrap>
          </SimpleGrid>
          <Divider />
          <Heading size={'md'} marginBottom={4}>
            회복 스킬
          </Heading>
          <SimpleGrid spacing={4} columns={2}>
            <Flex direction="column">
              <Heading size={'sm'} marginBottom={4}>
                금 스킬 수
              </Heading>
              <NumberField
                name="healSkills.gold"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 10 }}
              />
            </Flex>
            <Flex direction="column">
              <Heading size={'sm'} marginBottom={4}>
                일반 스킬 수
              </Heading>
              <NumberField
                name="healSkills.normal"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 10 }}
              />
            </Flex>
            <Flex direction="column">
              <Heading size={'sm'} marginBottom={4}>
                고유 스킬 레벨(⭐2 이하)
              </Heading>
              <NumberField
                name="healSkills.unique"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 10 }}
              />
            </Flex>
            <Flex direction="column">
              <Heading size={'sm'} marginBottom={4}>
                고유 스킬 레벨(⭐3 이상)
              </Heading>
              <NumberField
                name="healSkills.uniqueUpper"
                numberInputProps={{ allowMouseWheel: true, min: 0, max: 10 }}
              />
            </Flex>
          </SimpleGrid>
          <Divider />
          <Heading size={'md'} marginBottom={4}>
            레이스 상세
          </Heading>
          <SimpleGrid spacing={4} columns={2}>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                마장
              </Heading>
              <Select {...register('race.마장')}>
                {babas.map((baba) => (
                  <option value={baba}>{baba}</option>
                ))}
              </Select>
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                마장 상태
              </Heading>
              <Select {...register('race.마장상태')}>
                {babaStatuses.map((babaStatus) => (
                  <option value={babaStatus}>{babaStatus}</option>
                ))}
              </Select>
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                거리
              </Heading>
              <Select {...register('race.거리')}>
                {distances.map((distance) => (
                  <option value={distance}>{distance}</option>
                ))}
              </Select>
            </Wrap>
            <Wrap spacing={4} direction="row" align="center">
              <Heading size={'sm'} marginBottom={4}>
                거리 타입
              </Heading>
              {/* <Box>{거리타입by거리[watchValue.race.거리]}</Box> */}
              <Select
                value={거리타입by거리[watchValue.race.거리]}
                pointerEvents={'none'}
                // isDisabled
                variant="filled"
              >
                {distanceTypes.map((distanceType) => (
                  <option value={distanceType}>{distanceType}</option>
                ))}
              </Select>
            </Wrap>
          </SimpleGrid>
        </Stack>
        <Stack
          maxW={900}
          padding={4}
          spacing={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
        >
          <Heading size={'md'} marginBottom={4}>
            보정 스테이터스
          </Heading>
          <SimpleGrid spacing={4} columns={5}>
            <Flex direction="column" align="center">
              <Heading size={'sm'} marginBottom={4}>
                스피드
              </Heading>
              <Tag size={'lg'}>{Math.round(compensatedStat.speed)}</Tag>
            </Flex>
            <Flex direction="column" align="center">
              <Heading size={'sm'} marginBottom={4}>
                스테미나
              </Heading>
              <Tag size={'lg'}>{Math.round(compensatedStat.stamina)}</Tag>
            </Flex>
            <Flex direction="column" align="center">
              <Heading size={'sm'} marginBottom={4}>
                파워
              </Heading>
              <Tag size={'lg'}>{Math.round(compensatedStat.power)}</Tag>
            </Flex>
            <Flex direction="column" align="center">
              <Heading size={'sm'} marginBottom={4}>
                근성
              </Heading>
              <Tag size={'lg'}>{Math.round(compensatedStat.guts)}</Tag>
            </Flex>
            <Flex direction="column" align="center">
              <Heading size={'sm'} marginBottom={4}>
                지능
              </Heading>
              <Tag size={'lg'}>{Math.round(compensatedStat.intelligence)}</Tag>
            </Flex>
          </SimpleGrid>
          <Divider />
          <Heading size={'md'} marginBottom={4}>
            필요 스테미나
          </Heading>
          <Flex>
            <Stat>
              <StatNumber>{round2(idealSpurtStamina)}</StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    compensatedStat.stamina >= idealSpurtStamina
                      ? 'increase'
                      : 'decrease'
                  }
                />
                {`${round2(
                  (Math.abs(compensatedStat.stamina - idealSpurtStamina) /
                    idealSpurtStamina) *
                    100
                )}%  |  ${round2(compensatedStat.stamina - idealSpurtStamina)}`}
              </StatHelpText>
            </Stat>
          </Flex>
        </Stack>
      </Stack>
    </form>
  );
};

export default RacingPage;
