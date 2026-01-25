import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'text/plain', 'application/msword'],
  any: ['*/*'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ObjectUploader({ 
  onUploadComplete, 
  allowedTypes = 'image',
  maxSize = MAX_FILE_SIZE,
  className = '',
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedTypes = ALLOWED_TYPES[allowedTypes] || ALLOWED_TYPES.any;

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
    }
    
    if (allowedTypes !== 'any') {
      const isValidType = acceptedTypes.some(type => 
        type === '*/*' || file.type === type || file.type.startsWith(type.replace('/*', '/'))
      );
      if (!isValidType) {
        return `File type ${file.type} is not allowed`;
      }
    }
    
    return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Object Uploader — The Genuine Love Project" description="Explore object uploader tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Object Uploader</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  };

  const uploadFile = async (file) => {
    setError(null);
    setProgress(0);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const presignRes = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignRes.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL, objectPath } = await presignRes.json();
      setProgress(25);

      const uploadRes = await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      setProgress(100);
      setUploadedUrl(objectPath);
      
      if (onUploadComplete) {
        onUploadComplete({ url: objectPath, filename: file.name, type: file.type, size: file.size });
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const reset = () => {
    setUploadedUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadedUrl) {
    return (
      <div className={`p-4 border border-[var(--sage-200)] rounded-lg bg-[var(--sage-50)] ${className}`}>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-[var(--neutral-700)] flex-1">Upload complete</span>
          <button 
            onClick={reset}
            className="p-1 rounded hover:bg-[var(--neutral-100)] transition-colors"
            data-testid="button-upload-reset"
            aria-label="Remove uploaded file"
          >
            <X className="w-4 h-4 text-[var(--neutral-600)]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragOver 
            ? 'border-[var(--sage-500)] bg-[var(--sage-50)]' 
            : 'border-[var(--neutral-300)] hover:border-[var(--sage-400)] hover:bg-[var(--sage-25)]'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${uploading ? 'pointer-events-none opacity-75' : ''}
        `}
        data-testid="dropzone-upload"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="hidden"
          data-testid="input-file-upload"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto border-4 border-[var(--sage-200)] border-t-[var(--sage-600)] rounded-full animate-spin" />
            <p className="text-sm text-[var(--neutral-600)]">Uploading... {progress}%</p>
            <div className="w-full h-2 bg-[var(--neutral-200)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--sage-500)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto text-[var(--neutral-400)] mb-3" />
            <p className="text-sm font-medium text-[var(--neutral-700)]">
              Drop file here or click to upload
            </p>
            <p className="text-xs text-[var(--neutral-500)] mt-1">
              {allowedTypes === 'image' && 'JPEG, PNG, GIF, WebP up to 10MB'}
              {allowedTypes === 'document' && 'PDF, TXT, DOC up to 10MB'}
              {allowedTypes === 'any' && 'Any file up to 10MB'}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span data-testid="text-upload-error">{error}</span>
        </div>
      )}
    </div>
  );
}
