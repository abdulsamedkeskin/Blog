import React, { useRef, useState } from "react";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import axios from "axios";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FileUpload } from "primereact/fileupload";
import DialogContentText from "@material-ui/core/DialogContentText";

import { Toast } from "primereact/toast";
import Header from "./Header";

export default function NewBlog() {
  const [popUp, setPopUp] = useState(false);
  const [data, setData] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [disable, setDisable] = useState(true)
  const [tags, setTags] = useState();
  const toast = useRef(null);
  const [image, setImage] = useState();

  let options = {
    entityStyleFn: (entity) => {
      const entityType = entity.get("type").toLowerCase();
      if (entityType == "image") {
        const data = entity.getData();
        return {
          element: "img",
          attributes: {
            src: data.url,
          },
        };
      }
    },
  };
  

  const add = () => {
    const formData = new FormData();
    formData.append("image", image);
    const config = {
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("user"))?.accessToken,
      },
    };
    formData.append("content", String(data));
    formData.append(
      "data",
      JSON.stringify({
        title: title,
        author: JSON.parse(localStorage.getItem("user"))?.username,
        description: description,
        tags: tags.split(" ").map((item) => {
          return item;
        }),
      })
    );
    axios
      .post("http://localhost:5000/new", formData, config)
      .then((res) => {
        toast?.current?.show({
          severity: "info",
          summary: "Success",
          detail: "Blog Yayınlandı",
        });
        setPopUp(false);
      })
      .catch((err) =>
        toast?.current?.show({
          severity: "error",
          summary: "Error",
          detail: String(err),
        })
      );
  };

  return (
    <div>
      <Header title={"Medium"} />
      <Toast ref={toast} />

      <div className={"App"}>
        <MUIRichTextEditor
          label="Yazmaya başla..."
          onChange={(e) => setData(stateToHTML(e.getCurrentContent(), options))}
        />
      </div>
      <div>
        <Button onClick={() => setPopUp(true)} className={"send-button"}>
          Yayınla
        </Button>
      </div>
      <Dialog
        open={popUp}
        fullWidth
        maxWidth={"sm"}
        onClose={() => setPopUp(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Bloğu Yayınla</DialogTitle>
        <DialogContent>
          <TextField
            required
            fullWidth
            label={"Başlık"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>

        <DialogContent>
          <TextField
            required
            fullWidth
            label={"Açıklama"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            required
            fullWidth
            label={"Etiketler"}
            onChange={(e) => setTags(e.target.value)}
          />
          <br />
          <DialogContentText>
            İki etiket arasına boşluk bırakın.
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <label htmlFor={"file-upload"}>Blog resmi: </label>
          <FileUpload
            name={"image[]"}
            chooseLabel={"Blog Resmi"}
            mode={"basic"}
            customUpload
            uploadHandler={(e) => {
              setImage(e.files[0]);
              setDisable(false)
            }}
            auto
            accept={"image/*"}
            id={"file-upload"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopUp(false)} color="primary">
            İptal
          </Button>
          <Button onClick={add} color="primary" disabled={disable} >
            Yayınla
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
