## Task FE-1: useImagePreview hook

Implement src/hooks/use-image-preview.ts — đây là phần quan trọng nhất FE.

Signature:
function useImagePreview(sessionId: string | null): PreviewHookReturn

Yêu cầu chi tiết:

WebSocket setup (trong useEffect, dependency: [sessionId]):

- URL: ${import.meta.env.VITE_WS_URL}/ws/preview/${sessionId}
- ws.binaryType = "blob"
- Cleanup: ws.close() khi unmount hoặc sessionId thay đổi

onmessage handler:

- Nhận Blob
- Tạo ObjectURL: URL.createObjectURL(e.data)
- Gán vào imgRef.current.src
- Revoke URL CŨ (lưu trong prevUrlRef) TRƯỚC khi gán URL mới
- Cập nhật FPS: dùng fpsCounterRef đếm frame, tính mỗi 1 giây

sendParams:

- useCallback, dependency rỗng
- Kiểm tra ws.readyState === WebSocket.OPEN trước khi send
- Gửi JSON.stringify(params)
- KHÔNG debounce ở đây — backend đã rate-limit 30 FPS

isConnected state:

- true khi onopen fire
- false khi onclose hoặc onerror fire

Lưu ý bắt buộc:

- imgRef, prevUrlRef, fpsCounterRef đều là useRef — KHÔNG useState
- wsRef cũng là useRef
- Chỉ isConnected và fps là useState (vì cần render để hiển thị UI)
- Cleanup trong useEffect return: ws.close() + revokeObjectURL(prevUrlRef.current)

## Task FE-2: PlaygroundForm component

Implement src/components/widgets/playground-form.tsx

Layout: 2 cột — bên trái preview ảnh, bên phải panel controls

State cần thiết (useState):

- sessionId: string | null
- isUploading: boolean
- uploadError: string | null

Params KHÔNG dùng form — dùng useRef:
const paramsRef = useRef<PreviewParams>({
blur: 0,
sharpen: 0,
enhance: 0,
denoise: 0,
brightness: 0,
grayscale: 0,
jpeg_quality: 80
})

Upload flow:

- <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp">
- onChange: gọi uploadImage(file), set isUploading=true
- Thành công: setSessionId(session_id), isUploading=false
- Thất bại: setUploadError(message), isUploading=false

Preview:

- <img ref={imgRef} /> — imgRef từ hook
- Hiển thị placeholder khi chưa có sessionId
- Hiển thị spinner khi isUploading

Sliders (7 cái theo PreviewParams):

- Mỗi slider: sử dụng form field component của shadcnui như hiện tại nhưng sẽ không dùng tanstack form nữa mà dùng luôn component Slider từ [src/components/ui/slider.tsx](src/components/ui/slider.tsx)
- onChange handler:
  paramsRef.current = { ...paramsRef.current, [key]: parseFloat(e.target.value) }
  sendParams(paramsRef.current)
- Giá trị hiển thị: dùng e.target.value trực tiếp (không từ state)

Debug bar (nhỏ, bottom):

- Hiển thị: isConnected (dot xanh/đỏ) + fps + "FPS"
- Chỉ hiện khi có sessionId

DÙNG shadcnui + TailwindCSS đã cài trong dự án.
