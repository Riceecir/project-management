import React from "react";

/* 关键字高亮 */
export const Mark = ({ str, keyword }: { str: string; keyword: string }) => {
  if (!keyword) return <>{str}</>;

  const arr = str.split(keyword);
  return (
    <>
      {arr.map((str, index) => {
        return (
          <span key={index}>
            {str}
            {index !== arr.length - 1 && (
              <span style={{ color: "red" }}>{keyword}</span>
            )}
          </span>
        );
      })}
    </>
  );
};
