import { Center, Table, TableTbody, TableTh, TableThead, TableTr } from '@mantine/core';
import axios from 'axios';
import { constant, map } from 'lodash';
import React from 'react';

import GpsTableRow from '@/components/gps/GpsTableRow';
import TitleBar from '@/components/TitleBar';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { env } from '@/env.mjs';
import Car from '@/types/gps/Car';

export default async function GpsPage() {
  const data = await axios
    .get<Car[]>(`${env.GPS_API}/objects`, {
      params: {
        version: 1,
        api_key: env.GPS_API_KEY,
      },
    })
    .then((res) => res.data)
    .catch(constant(null));
  return (
    <>
      <TitleBar title='GPS' />
      {data ? (
        <Table stickyHeader withColumnBorders withTableBorder striped stickyHeaderOffset={60}>
          <TableThead>
            <TableTr>
              <TableTh>ID</TableTh>
              <TableTh>Автомобіль</TableTh>
              <TableTh>Локація</TableTh>
              <TableTh>Дистанція</TableTh>
              <TableTh>Час до прибуття</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {map(data, (car) => (
              <GpsTableRow key={car.id} car={car} />
            ))}
          </TableTbody>
        </Table>
      ) : (
        <Center>
          <ErrorAlert description='Не вдалось завантажити дані автомобілів' />
        </Center>
      )}
    </>
  );
}
