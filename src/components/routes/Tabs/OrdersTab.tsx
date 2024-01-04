'use client';

import { Accordion, Container, NumberFormatter } from '@mantine/core';
import { reduce } from 'lodash';
import { DataTable } from 'mantine-datatable';
import React, { useMemo } from 'react';
import { useWindowSize } from 'react-use';

import IRouteOrder from '@/types/routes/RouteOrder';

const CommentNotFoundText = 'Коментар відсутній';

const data: IRouteOrder[] = [
  {
    position: 1,
    id: 215_815,
    order: 1,
    time: '09:00',
    agent: 'ГУД ВІН ХХІ, ТОВ',
    pieces: 11,
    amount: 27,
    weight: 1538.926,
    manager: 'Тугучев Олександр',
    address: 'м.Харків, вул.Донець-Захоржевського,6/8 Андрій Руденко  тел. 068-277-43-93 тел. (093) 408-01-05',
    comments: {
      main: 'Склопакет 48.55мм 6 Low E ESG SE/16Al Ar PU /6 ESG SE/14Al Ar PU /6 Low E ESG SE  (2), Склопакет 60.45мм 8 Low E ESG SE/20Al Ar PU /6 ESG SE/18Al Ar PU /8 Low E ESG SE  (Глибина вторинної герметизації 6мм) (11), Склопакет 60.45мм 8 Low E ESG SE/20Al Ar PU /6 ESG SE Em RAL 8014 #4/18Al Ar PU /8 Low E ESG SE  (3)',
      delivery: 'піраміди залишити',
      packer: '16 вантажити по факту скільки є, вигрузка маніпулятором',
    },
  },
  {
    position: 2,
    id: 215_850,
    order: 1,
    time: '09:00',
    agent: 'ГУД ВІН ХХІ, ТОВ',
    pieces: 76,
    amount: 65.72,
    weight: 2345.062,
    manager: 'Тугучев Олександр',
    address: 'м.Харків, вул.Донець-Захоржевського,6/8 Андрій Руденко  тел. 068-277-43-93 тел. (093) 408-01-05',
    comments: {
      main: 'Склопакет 44.55мм 6 Low E ESG SE/16Al Ar PU /4 SE/14Al Ar PU /4 Low E SE  (2), Склопакет 50.55мм 6мм SunGuard HP Silver 35/26 ESG SE/18Al Ar PU /4 SE/18Al Ar PU /4 Low E SE  (16), Склопакет 44.55мм 6мм SunGuard HP Silver 35/26 ESG SE/16Al Ar PU /4 SE/14Al Ar PU /4 Low E SE  (56), Склопакет 44.55мм 6мм SunGuard HP Silver 35/26 ESG SE/14Al Ar PU /6 SE/12Al Ar PU /6 Low E SE  (2)',
      delivery: 'піраміди залишити',
      packer: 'вигрузка маніпулятором',
    },
  },
];

export default function OrdersTab() {
  const { height } = useWindowSize();
  const columns = useMemo(
    () => [
      {
        accessor: 'position',
        title: '#',
        footer: 'Σ',
      },
      {
        accessor: 'id',
        title: 'ID',
      },
      {
        accessor: 'order',
        title: 'Порядок',
      },
      {
        accessor: 'time',
        title: 'Час',
      },
      {
        accessor: 'agent',
        title: 'Контрагент',
      },
      {
        accessor: 'pieces',
        title: 'Шт.',
        footer: reduce(data, (acc, record) => acc + record.pieces, 0),
      },
      {
        accessor: 'amount',
        title: 'К-ть (m²)',
        render: (record: IRouteOrder) => <NumberFormatter value={record.amount} decimalScale={2} fixedDecimalScale />,
        footer: reduce(data, (acc, record) => acc + record.amount, 0),
      },
      {
        accessor: 'weight',
        title: 'Вага',
        render: (record: IRouteOrder) => <NumberFormatter value={record.weight} decimalScale={3} fixedDecimalScale />,
        footer: reduce(data, (acc, record) => acc + record.weight, 0),
      },
    ],
    []
  );
  return (
    <Container mt='sm' fluid p='0' h={height - 250}>
      <DataTable
        withTableBorder
        borderRadius='md'
        withColumnBorders
        columns={columns}
        records={data}
        minHeight='100%'
        noRecordsText='Не знайдено жодного замовлення'
        rowExpansion={{
          content: ({ record }) => (
            <Accordion>
              <Accordion.Item value='comment'>
                <Accordion.Control>Коментар</Accordion.Control>
                <Accordion.Panel>{record.comments.main ?? CommentNotFoundText}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='manager'>
                <Accordion.Control>Менеджер</Accordion.Control>
                <Accordion.Panel>{record.manager}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='address'>
                <Accordion.Control>Адреса доставки</Accordion.Control>
                <Accordion.Panel>{record.address}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='logist-comment'>
                <Accordion.Control>Коментар логіста</Accordion.Control>
                <Accordion.Panel>{record.comments.logist ?? CommentNotFoundText}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='delivery-comment'>
                <Accordion.Control>Коментар по доставці</Accordion.Control>
                <Accordion.Panel>{record.comments.delivery ?? CommentNotFoundText}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='manager-comment'>
                <Accordion.Control>Коментар менеджера</Accordion.Control>
                <Accordion.Panel>{record.comments.manager ?? CommentNotFoundText}</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value='packer-comment'>
                <Accordion.Control>Коментар для пакувальника</Accordion.Control>
                <Accordion.Panel>{record.comments.packer ?? CommentNotFoundText}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          ),
        }}
      />
    </Container>
  );
}
