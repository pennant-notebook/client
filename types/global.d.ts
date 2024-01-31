// global.d.ts
declare module '*.module.css';
declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';


declare module 'y-codemirror.next';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}