import { Badge, Card, Flex, NumberFormatter, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { split, trim } from "lodash";
import { CircleUserRound, MapPin, Receipt } from "lucide-react";
import Link from "next/link";
import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import type { Order } from "@/types/manager/Order";

import StatusBadge from "../StatusBadge";

interface IProps {
  order: Order;
}

function OrderItem({ order }: IProps) {
  const shipmentAt = useMemo(() => dayjs(order.shipmentAt), [order.shipmentAt]);

  return (
    <Card
      component={Link}
      href={`/manager/${order.id}`}
      shadow="sm"
      radius="md"
      p="md"
      h="100%"
      withBorder={order.locked}
      className={twMerge(
        "cursor-pointer select-none duration-300 hover:bg-[var(--mantine-color-dark-5)]",
        order.locked && "bg-[#3d2f2f] hover:bg-[#4d3f3f]",
      )}
    >
      <Title order={2}>{order.id}</Title>
      <Text size="sm" c="dimmed">
        {shipmentAt.format("DD.MM.YYYY")}
      </Text>
      <Flex direction="column" c="dimmed" gap="4px">
        <Flex wrap="wrap" gap="4px">
          {order.locked && (
            <Badge className="cursor-default select-none" variant="light" color="red">
              Заблоковано
            </Badge>
          )}
          <StatusBadge status={order.status} />
        </Flex>
        <Flex gap="4px">
          <CircleUserRound />
          <Text className="line-clamp-1">{trim(order.agent?.name)}</Text>
        </Flex>
        <Flex gap="4px">
          <MapPin />
          <Text className="line-clamp-1 w-full text-left">{split(trim(order.region), " ")[0] ?? ""}</Text>
        </Flex>
        {order.finance && (
          <Flex gap="4px">
            <Receipt />
            <Text c={order.finance.total - order.finance.pay > 0 ? "red" : "dimmed"}>
              <NumberFormatter
                value={order.finance.final}
                suffix={` ${order.finance.currency}`}
                decimalScale={0}
                thousandSeparator=" "
                fixedDecimalScale
              />
            </Text>
          </Flex>
        )}
      </Flex>
      <div className="flex-1" />
      {order.finance && (
        <Flex direction="row" mt="4px" justify={{ base: "flex-end", "2xs": "center", xs: "flex-end" }}>
          <NumberFormatter
            className="text-lg"
            value={order.finance.total}
            suffix={` ${order.finance.currency}`}
            decimalScale={0}
            thousandSeparator=" "
            fixedDecimalScale
          />
        </Flex>
      )}
    </Card>
  );
}

export default memo(OrderItem);
