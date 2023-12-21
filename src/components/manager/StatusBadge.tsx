import { Badge, DefaultMantineColor } from '@mantine/core';
import { toLower, trim } from 'lodash';
import React from 'react';

interface IStatusConfig {
  name: string;
  color: DefaultMantineColor;
}

function getStatusConfig(status: string): IStatusConfig {
  switch (trim(toLower(status))) {
    case 'принят менеджером': {
      return {
        color: 'orange',
        name: 'Прийнятий Менеджером',
      };
    }
    case 'снабжение': {
      return {
        color: 'yellow',
        name: 'Постачання',
      };
    }
    case 'производство': {
      return {
        color: 'blue',
        name: 'Производство',
      };
    }
    case 'утверждено производством': {
      return {
        color: 'cyan',
        name: 'Затверджено Виробництвом',
      };
    }
    case 'есть оптимизация': {
      return {
        color: 'indigo',
        name: 'Є Оптимізація',
      };
    }
    case 'склад частично': {
      return {
        color: 'violet',
        name: 'Склад Частково',
      };
    }
    case 'склад': {
      return {
        color: 'grape',
        name: 'Склад',
      };
    }
    case 'отгружен': {
      return {
        color: 'lime',
        name: 'Відвантажено',
      };
    }
    case 'отклонен': {
      return {
        color: 'red',
        name: 'Відхилено',
      };
    }
    case 'произведено (ручной статус)': {
      return {
        color: 'pink',
        name: 'Виготовлено (ручний статус)',
      };
    }
    case 'выполнено': {
      return {
        color: 'green',
        name: 'Виконано',
      };
    }
    default: {
      return {
        color: 'bg-slate-500 text-black hover:bg-slate-600',
        name: 'Невідомо',
      };
    }
  }
}

export default async function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className='cursor-default select-none' variant='light' color={getStatusConfig(status).color}>
      {getStatusConfig(status).name}
    </Badge>
  );
}
