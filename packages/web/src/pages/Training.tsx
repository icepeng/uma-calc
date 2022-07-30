import {
  Box,
  Heading,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrap,
} from '@chakra-ui/react';
import { trainingTypes } from '@uma-calc/core';
import React from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import StatBonusForm from '../components/StatBonusForm';
import SupportCardForm from '../components/SupportCardForm';
import TrainingLevelForm from '../components/TrainingLevelForm';
import {
  DeckForm,
  generateSummary,
  initialDeck,
  initialFormValue,
  TrainingForm,
} from './training-form';

const TrainingPage: React.FC = () => {
  const [decks, setDecks] = React.useState<DeckForm[]>(
    Array.from({ length: 10 }, () => initialDeck)
  );
  const [deckIndex, setDeckIndex] = React.useState<number>(0);
  const [initialized, setInitialized] = React.useState(false);

  const methods = useForm({
    defaultValues: initialFormValue,
  });
  const { fields, replace } = useFieldArray({
    control: methods.control,
    name: 'deck',
  });
  const formValues = useWatch({ control: methods.control });

  const mainStatSummary = React.useMemo(
    () =>
      generateSummary(
        formValues as TrainingForm,
        (stat, training) => stat[training]
      ),
    [formValues]
  );
  const totalSummary = React.useMemo(
    () =>
      generateSummary(formValues as TrainingForm, (stat, training) =>
        Object.values(stat).reduce((sum, x) => sum + x, 0)
      ),
    [formValues]
  );

  React.useEffect(() => {
    const savedDecksStr = localStorage.getItem('decks');
    if (!savedDecksStr) {
      return;
    }

    const savedDecks = JSON.parse(savedDecksStr);
    setDecks(savedDecks);
    replace(savedDecks[0]);
    setInitialized(true);
  }, []);

  React.useEffect(() => {
    if (!initialized) {
      return;
    }
    const nextDecks = [
      ...decks.slice(0, deckIndex),
      formValues.deck as DeckForm,
      ...decks.slice(deckIndex + 1),
    ];
    localStorage.setItem('decks', JSON.stringify(nextDecks));
    setDecks(nextDecks);
  }, [formValues]);

  const handleDeckChange = (index: number) => {
    setDeckIndex(index);
    replace(decks[index]);
  };

  return (
    <FormProvider {...methods}>
      <Stack padding={4} spacing={4} direction="row">
        <Stack
          maxW={900}
          padding={4}
          spacing={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
        >
          <Select
            value={deckIndex}
            onChange={(e) => handleDeckChange(+e.currentTarget.value)}
          >
            {decks.map((_, i) => (
              <option value={i} key={i}>
                덱 {i + 1}
              </option>
            ))}
          </Select>
          <Wrap spacing={4} direction="row" align="center">
            {fields.map((field, index) => (
              <SupportCardForm key={field.id} index={index} />
            ))}
          </Wrap>
          <TrainingLevelForm />
          <StatBonusForm />
        </Stack>
        <Stack>
          <Select {...methods.register('motivation')}>
            <option value={20}>최상</option>
            <option value={10}>양호</option>
            <option value={0}>보통</option>
            <option value={-10}>저조</option>
            <option value={-20}>최악</option>
          </Select>
          <Box
            padding={4}
            borderColor="gray.100"
            borderWidth={1}
            borderRadius={4}
          >
            <Heading size={'sm'} marginBottom={4}>
              메인 스탯 상승량
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>스피드 훈련</Th>
                    <Th>스태미나 훈련</Th>
                    <Th>파워 훈련</Th>
                    <Th>근성 훈련</Th>
                    <Th>지능 훈련</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>평균</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {mainStatSummary[training].avg.toFixed(1)}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 5%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{mainStatSummary[training].p5}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 10%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{mainStatSummary[training].p10}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 25%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{mainStatSummary[training].p25}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 50%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{mainStatSummary[training].p50}</Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            padding={4}
            borderColor="gray.100"
            borderWidth={1}
            borderRadius={4}
          >
            <Heading size={'sm'} marginBottom={4}>
              총합 스탯 상승량
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>스피드 훈련</Th>
                    <Th>스태미나 훈련</Th>
                    <Th>파워 훈련</Th>
                    <Th>근성 훈련</Th>
                    <Th>지능 훈련</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>평균</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {totalSummary[training].avg.toFixed(1)}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 5%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{totalSummary[training].p5}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 10%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{totalSummary[training].p10}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 25%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{totalSummary[training].p25}</Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>상위 50%</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>{totalSummary[training].p50}</Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default TrainingPage;
