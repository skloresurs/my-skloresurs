'use client';

import './index.css';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';

export default function Swagger() {
  return <SwaggerUI url='/swagger.json' />;
}
