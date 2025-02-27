interface ComboBoxOption {
  id: string;
  label: string;
}

interface AutocompleteSelectProps {
  id: string;
  label: string;
  placeholder: string;
  options: ComboBoxOption[];
  onFetchOptions: (searchTerm: string) => Promise<ComboBoxOption[]>;
  error?: boolean;
  isRequired?: boolean;
  fetchImmediately?: boolean;
  debounceTime?: number;
  onOptionSelect?: (option: ComboBoxOption) => void;
  minValueSearch?: number;
  onClean?: () => void;
}

export type { ComboBoxOption, AutocompleteSelectProps };
