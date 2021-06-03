import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function NewBlog() {
  const { id } = useParams();
  useEffect(() => {
    getBlog();
  }, []);

  const getBlog = () => {
    axios
      .get(`http://localhost:5000/api/${id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("user"))
            ?.accessToken,
        },
      })
      .then((res) => {
        document
          .querySelector("iframe")
          .contentDocument.write(res.data.content);
      })
      .catch((err) => console.log(err));
  };

  return <iframe width="100%" height="100%"></iframe>;
}
