import { NotebookType } from "@/NotebookTypes";
import {
  BookOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Dropdown, Input, InputRef, Modal, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { notebookTitleStateFamily, notebooksState, selectedDocIdState } from "~/appState";
import { fetchDoc } from "~/services/dynamoFetch";
import { deleteDoc, editDocTitle } from "~/services/dynamoPost";

import IconJS from "./assets/jsfolder.png";
import IconPY from "./assets/pyfolder.png";

import { useTheme } from "@mui/material";

const { confirm } = Modal;

interface TreeNotebookProps {
  notebook: NotebookType;
  username: string;
  index: number;
  language: string;
  handleSelectedDocId: (docID: string) => void;
}

const TreeNotebook = ({ notebook, username, handleSelectedDocId, language }: TreeNotebookProps) => {
  const [notebooks, setNotebooks] = useRecoilState(notebooksState);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(notebook.title || "");
  const inputRef = useRef<InputRef | null>(null);
  const [title, setTitle] = useRecoilState(notebookTitleStateFamily(notebook.docID));
  const [selectedDocId, setSelectedDocId] = useRecoilState(selectedDocIdState);

  const { refetch } = useQuery([notebook.docID, username], () =>
    fetchDoc(notebook.docID, username)
  );
  const theme = useTheme().palette.mode;

  useEffect(() => {
    setTitle(notebook.title || `Untitled`);
  }, [notebook, setTitle]);

  const deleteMutation = useMutation(deleteDoc, {
    onSuccess: () => {
      setNotebooks(notebooks.filter((n) => n.docID !== notebook.docID));
      if (selectedDocId === notebook.docID) {
        setSelectedDocId(null);
      }
    },
  });

  const handleNotebookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      handleSelectedDocId(notebook.docID);
    }
  };

  const editMutation = useMutation(editDocTitle, {
    onSuccess: () => {
      setTitle(newTitle);
      refetch();
    },
  });

  const handleRenameClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 0);
  };

  const handleDeleteClick = () => {
    confirm({
      title: "Are you sure you want to delete this notebook?",
      onOk() {
        deleteMutation.mutate({ docID: notebook.docID, username });
      },
    });
  };

  const handleSaveClick = () => {
    if (username) {
      editMutation.mutate({ docID: notebook.docID, title: newTitle, username });
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleCopyClick = () => {
    const notebookURL = `https://trypennant.com/${username}/${notebook.docID}`;
    navigator.clipboard
      .writeText(notebookURL)
      .then(() => {
        message.success("Notebook URL copied to clipboard");
      })
      .catch((err) => {
        message.error("Failed to copy URL: " + err);
      });
  };

  const handleClickToNavigate = () => {
    if (isEditing) return;
    const url = `/${username}/${notebook.docID}`;
    window.open(url, "_blank");
  };

  const items = [
    {
      label: "Open Notebook",
      key: "0",
      icon: <BookOutlined />,
      onClick: () => handleClickToNavigate(),
    },
    {
      label: "Rename Notebook",
      key: "1",
      icon: <EditOutlined />,
      onClick: () => handleRenameClick(),
    },
    {
      label: "Delete Notebook",
      key: "2",
      icon: <DeleteOutlined />,
      onClick: () => handleDeleteClick(),
    },
    {
      label: "Copy Notebook URL",
      key: "3",
      icon: <CopyOutlined />,
      onClick: () => handleCopyClick(),
    },
  ];

  const notebookIconSrc = language === "javascript" ? IconJS : IconPY;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}>
      {isEditing ? (
        <div style={{ flex: 1 }}>
          <Input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleCancelClick}
            onPressEnter={handleSaveClick}
            autoFocus
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "200px",
          }}>
          <div
            onClick={(e) => handleNotebookClick(e)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img
              src={notebookIconSrc}
              alt={`${language} Icon`}
              style={{ width: "16px", height: "16px", marginRight: "8px" }}
            />
            <span
              id="notebook-tree-title"
              style={{
                flexGrow: 1,
                maxWidth: "140px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
              {title || `Untitled`}
            </span>
          </div>
          <div
            id="dropdown-tree"
            className={`tree-dropdown ${theme}`}>
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              onOpenChange={(open) => {
                if (!open) {
                  // Handle dropdown close
                }
              }}>
              <a
                onClick={(e) => e.stopPropagation()}
                className={theme}>
                <EllipsisOutlined
                  className="ellipsis-icon"
                  style={{ justifyContent: "flex-end" }}
                />
              </a>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeNotebook;
