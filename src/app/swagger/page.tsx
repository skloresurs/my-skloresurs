'use client';

import './index.css';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';

import swagger from '@/swagger.json';

export default function Swagger() {
  return <SwaggerUI spec={swagger} />;
}
