import * as MaterialIcons from "@mui/icons-material";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import React from "react";
import "./styles.scss";
import { IconProps } from "./types";

const Icon: React.FC<IconProps> = ({
  name,
  type = "default",
  size,
  ...rest
}) => {
  const IconComponent = MaterialIcons[name] as React.ElementType;

  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado.`);
    return <ErrorOutlineOutlined style={{ color: "#ff4d4d" }} />;
  }

  const spanClassName =
    type === "default"
      ? `material-icons c-icon ${rest.className ?? ""}`
      : `material-icons-${type} c-icon ${rest.className ?? ""}`;

  const spanStyle = {
    ...rest.style,
    ...(size && { fontSize: size, width: size, height: size }),
    userSelect: "none",
  };

  return (
    <IconComponent {...rest} className={spanClassName} style={spanStyle}>
      {name}
    </IconComponent>
  );
};

export default Icon;
