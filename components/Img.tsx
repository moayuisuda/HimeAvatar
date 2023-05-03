import { Spin } from "antd";
import React, { DetailedHTMLProps, ImgHTMLAttributes, useState } from "react";

export const Img: React.FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const [loading, setLoading] = useState(true);

  return (
    <Spin spinning={loading} className="inline-block">
      <img
        onLoad={() => setLoading(false)}
        {...props}
        className={"rounded" + (props.className && " " + props.className)}
      />
    </Spin>
  );
};
