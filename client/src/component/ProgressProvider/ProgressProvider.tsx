import React, { useEffect, useState } from "react";

const ProgressProvider: React.FC<{ interval: number, values: number[]}> = ({ interval, values, children}) => {

  const [valuesIndex, setValuesIndex] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setValuesIndex( (valuesIndex + 1) % values.length)
    }, interval);
  }, [])

  // @ts-ignore
  return children(values[valuesIndex]);
};

export default ProgressProvider;
