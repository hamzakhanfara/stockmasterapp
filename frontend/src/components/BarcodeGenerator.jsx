import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = ({ value, options = {}, ...props }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (value && svgRef.current) {
      const defaultOpts = {
        format: 'CODE128',
        displayValue: true,
        textAlign: 'center',
        textMargin: 8,
        fontSize: 12,
        margin: 8,
        // height controls bar height; text is rendered below
        height: 60,
      };
      JsBarcode(svgRef.current, value, { ...defaultOpts, ...options });
    }
  }, [value, options]);

  return <svg ref={svgRef} {...props} />;
};

export default BarcodeGenerator;
