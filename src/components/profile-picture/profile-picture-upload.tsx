'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
  type SyntheticEvent,
} from 'react';
import Image from 'next/image';
import {
  Camera,
  Check,
  LoaderCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const DEFAULT_AVATAR = '/avatar/usus-avatar.avif';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CROP_SIZE = 112;
const OUTPUT_SIZE = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

type CropPosition = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

interface ProfilePictureUploadProps {
  initialAvatarUrl?: string;
  onImageChange?: (file: File | null, previewUrl: string) => void;
  onSave?: (croppedFile: File) => Promise<string>;
  disabled?: boolean;
}

export default function ProfilePictureUpload({
  initialAvatarUrl = DEFAULT_AVATAR,
  onImageChange,
  onSave,
  disabled = false,
}: ProfilePictureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const originalUrlRef = useRef<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const dragStartRef = useRef<CropPosition>({ x: 0, y: 0 });
  const positionStartRef = useRef<CropPosition>({ x: 0, y: 0 });

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [originalUrl, setOriginalUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [position, setPosition] = useState<CropPosition>({
    x: 0,
    y: 0,
  });

  const [imageSize, setImageSize] = useState<ImageSize>({
    width: 0,
    height: 0,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) {
        URL.revokeObjectURL(originalUrlRef.current);
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function clearOriginalUrl() {
    if (originalUrlRef.current) {
      URL.revokeObjectURL(originalUrlRef.current);
      originalUrlRef.current = null;
    }

    setOriginalUrl('');
  }

  function clearPreviewUrl() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    setError('');
    setSuccess('');

    if (
      !ACCEPTED_TYPES.includes(
        file.type as (typeof ACCEPTED_TYPES)[number],
      )
    ) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Your image must be 5 MB or smaller.');
      return;
    }

    clearOriginalUrl();
    clearPreviewUrl();

    const objectUrl = URL.createObjectURL(file);

    originalUrlRef.current = objectUrl;

    setOriginalUrl(objectUrl);
    setSelectedFile(file);
    setImageSize({ width: 0, height: 0 });
    setZoom(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
  }

  function handleImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;

    setImageSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  }

  function getScale(currentZoom = zoom) {
    if (!imageSize.width || !imageSize.height) {
      return 1;
    }

    return (
      Math.max(
        CROP_SIZE / imageSize.width,
        CROP_SIZE / imageSize.height,
      ) * currentZoom
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!selectedFile || !imageSize.width || isSaving) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    positionStartRef.current = { ...position };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const scale = getScale();

    const maxX = Math.max(
      0,
      (imageSize.width * scale - CROP_SIZE) / 2,
    );

    const maxY = Math.max(
      0,
      (imageSize.height * scale - CROP_SIZE) / 2,
    );

    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;

    setPosition({
      x: Math.max(
        -maxX,
        Math.min(maxX, positionStartRef.current.x + dx),
      ),
      y: Math.max(
        -maxY,
        Math.min(maxY, positionStartRef.current.y + dy),
      ),
    });
  }

  async function createCroppedImage(): Promise<File> {
    const image = imageRef.current;

    if (
      !image ||
      !selectedFile ||
      !imageSize.width ||
      !imageSize.height
    ) {
      throw new Error('The image is not ready. Please try again.');
    }

    const canvas = document.createElement('canvas');

    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Your browser could not process this image.');
    }

    const outputScale = OUTPUT_SIZE / CROP_SIZE;
    const scale = getScale() * outputScale;

    const drawWidth = imageSize.width * scale;
    const drawHeight = imageSize.height * scale;

    const centerX = OUTPUT_SIZE / 2 + position.x * outputScale;
    const centerY = OUTPUT_SIZE / 2 + position.y * outputScale;

    context.drawImage(
      image,
      centerX - drawWidth / 2,
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight,
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Unable to crop the image.'));
          }
        },
        'image/jpeg',
        0.92,
      );
    });

    const filename =
      selectedFile.name.replace(/\.[^.]+$/, '') || 'profile';

    return new File([blob], `${filename}-profile.jpg`, {
      type: 'image/jpeg',
    });
  }

  async function handleSave() {
    if (!selectedFile || isSaving || disabled) return;

    setError('');
    setSuccess('');
    setIsSaving(true);

    let temporaryPreviewUrl: string | null = null;

    try {
      const croppedFile = await createCroppedImage();

      temporaryPreviewUrl = URL.createObjectURL(croppedFile);

      let finalUrl = temporaryPreviewUrl;

      if (onSave) {
        finalUrl = await onSave(croppedFile);

        if (!finalUrl) {
          throw new Error('The server did not return an image URL.');
        }

        URL.revokeObjectURL(temporaryPreviewUrl);
        temporaryPreviewUrl = null;
      }

      clearPreviewUrl();
      clearOriginalUrl();

      if (temporaryPreviewUrl) {
        previewUrlRef.current = temporaryPreviewUrl;
      }

      setAvatarUrl(finalUrl);
      setOriginalUrl('');
      setSelectedFile(null);
      setImageSize({ width: 0, height: 0 });
      setZoom(MIN_ZOOM);
      setPosition({ x: 0, y: 0 });
      setSuccess('Profile picture updated successfully.');

      onImageChange?.(croppedFile, finalUrl);
    } catch (saveError: unknown) {
      if (temporaryPreviewUrl) {
        URL.revokeObjectURL(temporaryPreviewUrl);
      }

      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save your profile picture.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const scale = getScale();

  return (
    <section
      className="flex w-full flex-col items-center"
      aria-label="Profile picture settings"
    >
      <div className="relative">
        <div
          className={`
            relative h-28 w-28 overflow-hidden rounded-full
            border-2 bg-[var(--usus-primary-soft)]
            ${
              selectedFile
                ? 'touch-none cursor-grab border-[var(--usus-primary)] active:cursor-grabbing'
                : 'border-[var(--usus-border-soft)]'
            }
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => {
            if (
              event.currentTarget.hasPointerCapture(event.pointerId)
            ) {
              event.currentTarget.releasePointerCapture(
                event.pointerId,
              );
            }
          }}
          onPointerCancel={(event) => {
            if (
              event.currentTarget.hasPointerCapture(event.pointerId)
            ) {
              event.currentTarget.releasePointerCapture(
                event.pointerId,
              );
            }
          }}
        >
          {selectedFile && originalUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              ref={imageRef}
              src={originalUrl}
              alt="Adjust your profile picture"
              draggable={false}
              onLoad={handleImageLoad}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: imageSize.width
                  ? `${imageSize.width * scale}px`
                  : 'auto',
                height: imageSize.height
                  ? `${imageSize.height * scale}px`
                  : 'auto',
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              }}
            />
          ) : (
            <Image
              src={avatarUrl || DEFAULT_AVATAR}
              alt="Profile picture"
              width={112}
              height={112}
              unoptimized
              className="h-full w-full rounded-full object-cover"
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isSaving}
          aria-label="Choose profile picture"
          title="Choose profile picture"
          className="
            absolute bottom-0 right-0 flex h-9 w-9
            items-center justify-center rounded-full
            border-2 border-[var(--usus-border-soft)]
            bg-[var(--usus-primary)] text-black shadow-md
            transition hover:opacity-90 disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Camera size={16} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isSaving}
        className="hidden"
        aria-label="Upload a profile picture"
      />

      <p className="mt-3 max-w-xs truncate text-center text-sm text-[var(--usus-text-muted)]">
        {selectedFile?.name ?? 'Choose a profile picture'}
      </p>

      <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
        JPG, PNG or WebP · Maximum 5 MB
      </p>

      {selectedFile && (
        <div className="mt-4 w-full max-w-xs">
          <p className="mb-3 text-center text-xs text-[var(--usus-text-muted)]">
            Drag the picture inside the circle to position it.
          </p>

          <div className="mb-3 flex items-center justify-between text-sm">
            <span>Zoom</span>

            <span className="text-[var(--usus-text-muted)]">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setZoom((value) =>
                  Math.max(
                    MIN_ZOOM,
                    Math.round((value - 0.1) * 10) / 10,
                  ),
                )
              }
              disabled={zoom <= MIN_ZOOM || isSaving}
              aria-label="Zoom out"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-lg border border-[var(--usus-border-soft)]
                disabled:opacity-40
              "
            >
              <ZoomOut size={18} />
            </button>

            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              disabled={isSaving}
              aria-label="Zoom profile picture"
              className="min-w-0 flex-1 accent-[var(--usus-primary)]"
            />

            <button
              type="button"
              onClick={() =>
                setZoom((value) =>
                  Math.min(
                    MAX_ZOOM,
                    Math.round((value + 0.1) * 10) / 10,
                  ),
                )
              }
              disabled={zoom >= MAX_ZOOM || isSaving}
              aria-label="Zoom in"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-lg border border-[var(--usus-border-soft)]
                disabled:opacity-40
              "
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={disabled || isSaving || !imageSize.width}
            className="
              mt-5 flex w-full items-center justify-center gap-2
              rounded-lg bg-[var(--usus-primary)] px-4 py-3
              text-sm font-semibold text-black transition
              hover:opacity-90 disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSaving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={17} />
                Save profile picture
              </>
            )}
          </button>
        </div>
      )}

      {error && !selectedFile && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mt-3 text-sm text-green-500">
          {success}
        </p>
      )}
    </section>
  );
}