import {
  Page,
  Layout,
  FormLayout,
  TextField,
  Button,
  LegacyCard,
  LegacyStack,
  Thumbnail,
  DropZone,
  Text
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { NoteIcon } from "@shopify/polaris-icons";

const ProductForm = () => {
  // Khởi tạo state cho từng trường nhập liệu
  const [title, setTitle] = useState("");
  const [body_html, setBodyHtml] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const handleDropZoneDrop = useCallback(
    (dropFiles, _acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...dropFiles]),
    []
  );

  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    []
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.indexOf(file.type) > -1
                ? window.URL.createObjectURL(file)
                : NoteIcon
            }
          />
          <div>
            {file.name}{" "}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body_html", body_html);
    formData.append("price", price);
    formData.append("image", files[0]);

    try {
      const response = await fetch("http://localhost:5000/api/products/create-product", {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      if (response.ok) {
        setMessage("Thêm sản phẩm thành công!");
        resetForm();
      } else {
        setMessage("Lỗi thêm sản phẩm!");
      }
    } catch (error) {
      setMessage("Lỗi thêm sản phẩm!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setBodyHtml("");
    setPrice("");
    setFiles([]);
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <FormLayout>
            <h1>Thêm Sản Phẩm Mới</h1>
            <TextField
              label="Tên Sản Phẩm"
              value={title}
              onChange={(value) => setTitle(value)}
              autoComplete="off"
            />
            <TextField
              label="Mô Tả"
              value={body_html}
              onChange={(value) => setBodyHtml(value)}
              autoComplete="off"
              multiline={4}
            />
            <TextField
              label="Giá"
              type="number"
              value={price}
              onChange={(value) => setPrice(value)}
              autoComplete="off"
            />
            <LegacyCard
              sectioned
              title="Product Images"
              actions={[
                {
                  content: "Upload Image",
                  onAction: toggleOpenFileDialog
                }
              ]}
            >
              <DropZone
                openFileDialog={openFileDialog}
                onDrop={handleDropZoneDrop}
                onFileDialogClose={toggleOpenFileDialog}
              >
                {uploadedFiles}
              </DropZone>
            </LegacyCard>
            <Button primary onClick={handleSubmit}>
              Thêm Sản Phẩm
            </Button>
            {message && <p>{message}</p>}
          </FormLayout>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ProductForm;
