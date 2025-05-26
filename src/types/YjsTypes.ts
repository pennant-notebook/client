import * as Y from "yjs";

// Define better types for Yjs data structures

// Refined Yjs types
export type YDoc = Y.Doc;
export type YArray<T = any> = Y.Array<T>;
export type YMap<T = any> = Y.Map<T>;
export type YText = Y.Text;
export type YXmlElement = Y.XmlElement;
export type YXmlFragment = Y.XmlFragment;
export type YXmlText = Y.XmlText;

export type YMapEvent<T> = Y.YMapEvent<T>;

// export type YDoc = Y.Doc;
// export type YArray = Y.Array<any>;
// export type YMap = Y.Map<any>;
// export type YText = Y.Text;
// export type YXmlElement = Y.XmlElement;
// export type YXmlFragment = Y.XmlFragment;
// export type YXmlText = Y.XmlText;
