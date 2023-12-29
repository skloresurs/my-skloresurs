interface INomenclature {
  value: string;
  label: string;
  thickness?: number;
  allowHardening?: boolean;
  requireHardening?: boolean;
  requireEdgeProcessing?: boolean;
}

export default INomenclature;
