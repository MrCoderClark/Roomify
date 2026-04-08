import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { useOutletContext } from "react-router";
import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from "../lib/constants";

const Upload = ({ onComplete }: { onComplete?: (base64: string) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const processFile = (file: File) => {
    if (!isSignedIn) return;

    setFile(file);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
            setTimeout(() => {
              onComplete?.(base64Data);
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return prev + PROGRESS_STEP;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSignedIn) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  return (
    <div className={"upload"}>
      {!file ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type={"file"}
            className={"drop-input"}
            accept={".jpg,.jpeg,.png"}
            disabled={!isSignedIn}
            onChange={handleFileChange}
          />
          <div className={"drop-content"}>
            <div className={"drop-icon"}>
              <UploadIcon size={"20"} />
            </div>
            <p>
              {isSignedIn
                ? "Click to upload or just drag and drop"
                : "Sign in or sign up with Puter to upload"}
            </p>
            <p className={"help"}>Maximum file size 50 MB.</p>
          </div>
        </div>
      ) : (
        <div className={"upload-status"}>
          <div className={"status-content"}>
            <div className={"status-icon"}>
              {progress === 100 ? (
                <CheckCircle2 className={"check"} />
              ) : (
                <ImageIcon className={"image"} />
              )}
            </div>

            <h3>{file.name}</h3>

            <div className={"progress"}>
              <div className={"bar"} style={{ width: `${progress}%` }} />

              <p className={"status-text"}>
                {progress < 100 ? "Analyzing Floor plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Upload;
