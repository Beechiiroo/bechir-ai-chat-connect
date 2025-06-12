import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image, FileText, Video, Music } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  onClose: () => void;
}

export function FileUpload({ onUpload, onClose }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="w-64 p-4 border shadow-lg z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Partager un fichier</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-green-500 bg-green-50" : "border-muted"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-3">
          Glissez un fichier ici ou cliquez pour sélectionner
        </p>
        
        <input
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center p-2 rounded border hover:bg-muted transition-colors">
              <Image className="h-4 w-4 mb-1" />
              <span className="text-xs">Image</span>
            </div>
          </label>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center p-2 rounded border hover:bg-muted transition-colors">
              <FileText className="h-4 w-4 mb-1" />
              <span className="text-xs">Document</span>
            </div>
          </label>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center p-2 rounded border hover:bg-muted transition-colors">
              <Video className="h-4 w-4 mb-1" />
              <span className="text-xs">Vidéo</span>
            </div>
          </label>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center p-2 rounded border hover:bg-muted transition-colors">
              <Music className="h-4 w-4 mb-1" />
              <span className="text-xs">Audio</span>
            </div>
          </label>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Max 10MB • Images, vidéos, documents
        </p>
      </div>
    </Card>
  );
}