import { createAction } from '@reduxjs/toolkit';

export const settlementValidated = createAction<{
  slipId: string;
  agentId: string;
}>('settlements/settlementValidated');
