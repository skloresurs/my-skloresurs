"use client";

import { Center, Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import { map, sortBy } from "lodash";
import useSWR from "swr";

import type CarData from "@/types/gps/CarData";

import ErrorAlert from "../ui/ErrorAlert";

export default function GpsTable() {
  const { data, error, isValidating } = useSWR<CarData[]>("/api/gps");
  if (isValidating) {
    <Skeleton w="100%" h="250px" />;
  }
  if (error) {
    return (
      <Center>
        <ErrorAlert description="Не вдалось завантажити дані автомобілів" />
      </Center>
    );
  }
  return (
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
        {map(sortBy(data, "distance.value"), (el) => (
          <TableTr key={el.id}>
            <TableTd>{el.id}</TableTd>
            <TableTd>{el.name}</TableTd>
            <TableTd>{el.address}</TableTd>
            <TableTd>{el.distance.text}</TableTd>
            <TableTd>{el.time.text}</TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
}
