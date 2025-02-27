import { Box, Input, Group, Text } from "@chakra-ui/react";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useClickOutside } from "../../hooks/useClickOutside";
import Icon from "../Icon";
import "./styles.scss";
import { AutocompleteSelectProps, ComboBoxOption } from "./types";

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  id,
  label,
  placeholder,
  options,
  onFetchOptions,
  error,
  isRequired = false,
  fetchImmediately = false,
  onOptionSelect,
  minValueSearch = 0,
  onClean,
  debounceTime = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const handleFetchImmediately = useCallback(
    async (value?: string) => {
      const filtered = await onFetchOptions(value?.toLowerCase() ?? "");
      setFilteredOptions(filtered);
    },
    [onFetchOptions]
  );

  const debounced = useDebouncedCallback((value: string) => {
    handleFetchImmediately(value);
  }, debounceTime);

  const handleInputChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const searchTerm = (e.target as HTMLInputElement).value;
    setInputValue(searchTerm);

    if (searchTerm.length >= minValueSearch && !isSelected) {
      setFilteredOptions(options);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelect = (selectedOption: ComboBoxOption) => {
    onOptionSelect?.(selectedOption);
    setInputValue(selectedOption?.label ?? "");
    setFilteredOptions([]);
    setIsSelected(!!selectedOption);
  };

  const handleClean = () => {
    setInputValue("");
    setIsSelected(false);
    onClean?.();
  };

  useEffect(() => {
    if (fetchImmediately) {
      handleFetchImmediately();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchImmediately]);

  useEffect(() => {
    if (inputValue && inputValue.length >= minValueSearch && !isSelected) {
      debounced(inputValue);
    }
  }, [debounced, inputValue, isSelected, minValueSearch]);

  useClickOutside(containerRef, () => setIsFocus(false));

  return (
    <div className="autocomplete_select" ref={containerRef}>
      <label htmlFor={id} className="autocomplete_select-label">
        {label}
        {isRequired && <span className="required">*</span>}
      </label>
      <Group className="autocomplete_select-input-group">
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          autoComplete="off"
          onKeyUp={handleInputChange}
          onChange={handleInputChange}
          onFocus={() => setIsFocus(true)}
          className={`autocomplete_select-input ${
            isSelected ? "selected" : ""
          }`}
        />
        <span className="autocomplete_select-right-element">
          {inputValue.length > 0 && (
            <button type="button" onClick={handleClean}>
              Limpar
            </button>
          )}
          <Icon
            name="ArrowDropDownOutlined"
            size={16}
            color="#0c0c0b"
            style={{
              color: "#0c0c0b",
              fontWeight: "lighter",
            }}
          />
        </span>
      </Group>
      {inputValue.length >= minValueSearch &&
        filteredOptions.length > 0 &&
        isFocus && (
          <Box className="autocomplete_select-box-container">
            {filteredOptions.map((option) => (
              <Box
                key={`${option.id} - ${option.label}`}
                p={2}
                cursor="pointer"
                _hover={{ bg: "#eaeaea" }}
                onClick={() => handleSelect(option)}
              >
                <Text fontSize={"14px"}>{option.label}</Text>
              </Box>
            ))}
          </Box>
        )}
      {error && isRequired && (
        <span className="error-message">Campo obrigatório</span>
      )}
    </div>
  );
};

export default AutocompleteSelect;
