import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "foodcheck",
  brand: {
    displayName: "푸드 체크", // 화면에 노출될 앱의 한글 이름
    primaryColor: "#3182f6", // 화면에 노출될 앱의 기본 색상
    icon: "", // 앱 아이콘 이미지 주소 (콘솔 등록 시 입력)
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  // 바코드 스캔을 위해 카메라 권한이 필요해요.
  permissions: [{ name: "camera", access: "access" }],
  // iOS WebView 안에서 카메라 영상이 전체화면으로 가로채지 않고
  // 인라인으로 재생되도록 설정해요.
  webViewProps: {
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
  },
  outdir: "dist",
});
