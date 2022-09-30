import React, { memo }  from "react";
import ReactQuill from "react-quill";

export interface IEditor {
  value: string;
  onChange: (value: string) => void
}

const Editor: React.FC<IEditor> = ({ value, onChange}) => {

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={value}
      onChange={onChange}
    />
  );
};

export default memo(Editor);

