import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, Storage } from "aws-amplify";
import React, { useState } from "react";
import awsExports from "../src/aws-exports";

Amplify.configure({
  ...awsExports,
  ssr: true,
});
const filename = "filename" + Math.random() * 10000;
let result;

function StorageApp() {
  const [fileExists, setFileExists] = useState(false);
  const [uploadResponse, setUploadResponse] = useState("");
  const [s3Status, setS3Status] = useState("");

  const upload = async () => {
    const response = await Storage.put(filename, JSON.stringify(awsExports), {
      contentType: "application/json",
    });
    if (typeof response !== "undefined" && response && response.hasOwnProperty("key")) {
      // @ts-ignore
      setUploadResponse(`Uploaded ${response["key"]}`);
    }
    setS3Status("upload");
    // @ts-ignore
    console.log("uploaded", response["key"]);
  };

  const list = async () => {
    const response = await Storage.list("");
    console.log(response);
    setFileExists(response.filter((file) => file.key === filename).length > 0);
    setS3Status("list");
  };

  const get = async (filename, status) => {
    result = await Storage.get(filename);
    console.log("get result ", result);
    setS3Status(status);
  };

  const remove = async () => {
    console.log("remove result ", await Storage.remove(filename));
  };

  const getResult = () => {
    switch (s3Status) {
      case "upload":
        return <div data-test="storage-response">{uploadResponse}</div>;

      case "list":
        return <div data-test="storage-response">File exists: {`${fileExists}`}</div>;

      case "get":
      case "getBad":
        return (
          <div data-test="storage-response">
            <img src={result} alt="" />
          </div>
        );

      default:
        return <div>Click above</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">Storage</header>
      <div>
        <button data-test="storage-upload-button" title="Upload file" onClick={upload}>
          Upload file
        </button>
        <button data-test="storage-list-button" title="List files after Upload" onClick={list}>
          List files
        </button>
        <button
          data-test="storage-get-button"
          title="Get the file"
          onClick={() => get("amplify.png", "get")}
        >
          Get file
        </button>
        <button
          data-test="storage-get-bad-button"
          title="Get bad file"
          onClick={() => get("test.jpg", "getBad")}
        >
          Get bad file
        </button>
        <button data-test="storage-remove-button" title="Remove the file" onClick={remove}>
          Remove file
        </button>
        <br />
        <br />

        {getResult()}
      </div>
    </div>
  );
}

export default withAuthenticator(StorageApp);
