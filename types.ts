
export interface AddonFile {
  path: string;
  content: string;
}

export interface AddonResult {
  name: string;
  description: string;
  files: AddonFile[];
  imageUrl: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: boolean;
  result: AddonResult | null;
}
