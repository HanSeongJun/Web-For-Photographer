import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('main.tsx 로딩 시작');

try {
  const rootElement = document.getElementById("root");
  console.log('root 요소 찾음:', rootElement);
  
  if (!rootElement) {
    throw new Error('root 요소를 찾을 수 없습니다');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root 생성됨');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App 컴포넌트 렌더링 완료');
} catch (error) {
  console.error('React 앱 초기화 중 에러 발생:', error);
  
  // 에러 발생 시 간단한 메시지 표시
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">앱 로딩 중 오류가 발생했습니다</h1>
        <p>에러: ${error}</p>
        <p>페이지를 새로고침해주세요.</p>
      </div>
    `;
  }
}
