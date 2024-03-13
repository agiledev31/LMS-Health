import React, { createRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

function CardEditor({ content, setContent }) {
  const editorRef = createRef();

  return (
    <Editor
      ref={editorRef}
      apiKey="7cs0yziy6yddtxnyk548secekvsw7mxb0rmpop5xwce2ld35"
      initialValue={content}
      init={{
        menubar: false,
        plugins: " link lists media codesample quickbars",
        toolbar:
          "undo redo | styles | bold italic underline forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link quickimage",
        placeholder: "Write the card here...",
        branding: false,
      }}
      onEditorChange={(content) => {
        setContent(content);
      }}
    />
  );
}

export default CardEditor;
