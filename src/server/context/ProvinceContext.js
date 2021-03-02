import React, { createContext, useState } from "react";

const ProvinceContext = createContext([{}, () => {}]);

const ProvinceProvider = (props) => {
  const [state, setState] = useState({
    provinceCode: "",
    provinceName: "",
    countryCode: "fld_002",
    isActive: Boolean,
    sequenceNumber: Number,
    paramOne: "",
  });

  return (
    <ProvinceContext.Provider value={[state, setState]}>
      {props.children}
    </ProvinceContext.Provider>
  );
};

export { ProvinceContext, ProvinceProvider };
