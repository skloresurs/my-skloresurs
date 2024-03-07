'use client';

import { TableTd, TableTr } from '@mantine/core';
import React from 'react';
import useSWR from 'swr';

import Car from '@/types/gps/Car';

interface IProps {
  car: Car;
}

interface IReposponse {
  address: string;
  distance: string;
  time: string;
}

export default function GpsTableRow({ car }: IProps) {
  const { data, error, isValidating } = useSWR<IReposponse>(`/api/gps/${car.id}`);
  return (
    <TableTr key={car.id}>
      <TableTd>{car.name}</TableTd>
      {isValidating && (
        <>
          <TableTd>Завантаження...</TableTd>
          <TableTd />
          <TableTd />
        </>
      )}
      {!isValidating && error && (
        <>
          <TableTd />
          <TableTd />
          <TableTd />
        </>
      )}
      {data &&
        (data.address === 'вулиця Семидубська, 105, Дубно, Рівненська область, Україна, 35600' ? (
          <>
            <TableTd>Склоресурс</TableTd>
            <TableTd />
            <TableTd />
          </>
        ) : (
          <>
            <TableTd>{data.address}</TableTd>
            <TableTd>{data.distance}</TableTd>
            <TableTd>{data.time}</TableTd>
          </>
        ))}
    </TableTr>
  );
}
