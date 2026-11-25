"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import {
  deleteKnowledgeBaseDocument,
  getKnowledgeBaseDocument,
  getKnowledgeBaseDocuments,
  uploadKnowledgeBaseDocument,
  type KnowledgeBaseDocument,
} from "@/services/knowledge-base-service";

type Tab =
  | "upload"
  | "search"
  | "documents"
  | "recent"
  | "manage"
  | "settings";

type DocumentStatus = "processing" | "ready" | "failed";


const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "upload", label: "Upload", icon: "upload" },
  { id: "search", label: "Search", icon: "search" },
  { id: "documents", label: "Documents", icon: "documents" },
  { id: "recent", label: "Recent", icon: "clock" },
  { id: "manage", label: "Manage", icon: "manage" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const acceptedExtensions = [".pdf", ".docx"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function getFileType(fileType: string) {
  return fileType.toUpperCase();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Icon({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M4 16v4h16v-4" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "documents":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h8" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "manage":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="1" />
          <circle cx="16" cy="12" r="1" />
          <circle cx="10" cy="17" r="1" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      );

    default:
      return null;
  }
}

export default function KnowledgeBasePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] =
    useState<Tab>("documents");

  const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [autoIndex, setAutoIndex] = useState(true);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);

  const refreshDocuments = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const result = await getKnowledgeBaseDocuments();
      setDocuments(result);
      setPageError("");
      setSelectedDocument((current) =>
        current.filter((id) => result.some((document) => document.id === id)),
      );
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to load knowledge base documents.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      try {
        const result = await getKnowledgeBaseDocuments();

        if (!active) return;

        setDocuments(result);
        setPageError("");
      } catch (error) {
        if (!active) return;

        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load knowledge base documents.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments();

    return () => {
      active = false;
    };
  }, []);

  // Processing is asynchronous on the backend. Refresh processing records until
  // the API reports their final status (ready or failed).
  useEffect(() => {
    const processingIds = documents
      .filter((document) => document.status === "processing")
      .map((document) => document.id);

    if (processingIds.length === 0) return;

    const timer = window.setInterval(async () => {
      const updates = await Promise.allSettled(
        processingIds.map((id) => getKnowledgeBaseDocument(id)),
      );
      const byId = new Map<string, KnowledgeBaseDocument>();
      updates.forEach((result) => {
        if (result.status === "fulfilled") byId.set(result.value.id, result.value);
      });
      if (byId.size > 0) {
        setDocuments((current) =>
          current.map((document) => byId.get(document.id) ?? document),
        );
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [documents]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    const rejectedFiles: string[] = [];
    const uploadedFiles: string[] = [];

    setIsUploading(true);
    setUploadMessage("");
    setPageError("");

    for (const file of selectedFiles) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;

      if (!acceptedExtensions.includes(extension)) {
        rejectedFiles.push(`${file.name} (only PDF and DOCX are supported)`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        rejectedFiles.push(`${file.name} (exceeds the 20 MB limit)`);
        continue;
      }

      try {
        const uploaded = await uploadKnowledgeBaseDocument(file);
        setDocuments((current) => [
          uploaded,
          ...current.filter((document) => document.id !== uploaded.id),
        ]);
        uploadedFiles.push(file.name);
      } catch (error) {
        rejectedFiles.push(
          `${file.name} (${error instanceof Error ? error.message : "upload failed"})`,
        );
      }
    }

    if (uploadedFiles.length > 0) {
      setUploadMessage(
        `${uploadedFiles.length} document(s) uploaded. Processing status is provided by the backend.`,
      );
    }
    if (rejectedFiles.length > 0) {
      setUploadMessage((current) =>
        [current, `Not uploaded: ${rejectedFiles.join("; ")}`].filter(Boolean).join(" "),
      );
    }

    setIsUploading(false);
    setActiveTab("documents");
    await refreshDocuments();
  }, [refreshDocuments]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void handleFiles(event.target.files);
      event.target.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      void handleFiles(event.dataTransfer.files);
    }
  }

  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    if (activeTab === "recent") {
      result = result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((document) =>
        document.filename.toLowerCase().includes(query),
      );
    }

    if (filter !== "All") {
      result = result.filter((document) => document.status === filter);
    }

    return result;
  }, [documents, activeTab, search, filter]);

  const totalSize = documents.reduce(
    (total, document) => total + document.size_bytes,
    0,
  );
  const readyCount = documents.filter((document) => document.status === "ready").length;
  const failedCount = documents.filter((document) => document.status === "failed").length;

  async function deleteDocument(id: string) {
    try {
      await deleteKnowledgeBaseDocument(id);
      setDocuments((previous) => previous.filter((document) => document.id !== id));
      setSelectedDocument((previous) => previous.filter((selectedId) => selectedId !== id));
      setConfirmDelete(null);
      setUploadMessage("Document deleted.");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to delete document.");
    }
  }

  async function deleteSelected() {
    const ids = [...selectedDocument];
    const results = await Promise.allSettled(ids.map((id) => deleteKnowledgeBaseDocument(id)));
    const deletedIds = ids.filter((_, index) => results[index].status === "fulfilled");
    setDocuments((current) => current.filter((document) => !deletedIds.includes(document.id)));
    setSelectedDocument((current) => current.filter((id) => !deletedIds.includes(id)));
    const failed = results.length - deletedIds.length;
    setUploadMessage(
      failed === 0
        ? `${deletedIds.length} document(s) deleted.`
        : `${deletedIds.length} document(s) deleted; ${failed} could not be deleted.`,
    );
    if (failed > 0) await refreshDocuments();
  }

  function toggleSelected(id: string) {
    setSelectedDocument((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function toggleAll() {
    if (
      selectedDocument.length === filteredDocuments.length
    ) {
      setSelectedDocument([]);
    } else {
      setSelectedDocument(
        filteredDocuments.map((document) => document.id),
      );
    }
  }

  /* ============================================================
     TAB CONTENT
  ============================================================ */

  function renderDocuments() {
    return (
      <div className="space-y-5">

        {/* DOCUMENT TABLE HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-semibold text-[var(--usus-text)]">
              Document Library
            </h2>

            <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
              Manage the documents available to your AI training system.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refreshDocuments(true)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-sm text-[var(--usus-text)] transition-colors hover:bg-[var(--usus-surface-soft)]"
          >
            <Icon name="refresh" size={15} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* API ERROR */}

        {pageError && (
          <div className="border border-[var(--usus-danger)] bg-[var(--usus-surface-soft)] px-4 py-3 text-sm text-[var(--usus-danger)]">
            {pageError}
          </div>
        )}

        {/* UPLOAD NOTIFICATION */}

        {uploadMessage && (
          <div className="flex items-start gap-2 border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] px-4 py-3 text-sm text-[var(--usus-text)]">
            <Icon name="check" size={17} />
            <p>{uploadMessage}</p>
          </div>
        )}

        {/* SEARCH AND FILTER */}

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--usus-text-soft)]">
              <Icon name="search" size={17} />
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search documents..."
              className="w-full border border-[var(--usus-border)] bg-[var(--usus-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--usus-text)] outline-none placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)]"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2.5 text-sm text-[var(--usus-text)] outline-none focus:border-[var(--usus-primary)]"
          >
            <option value="All">All statuses</option>
            
            <option value="processing">processing</option>
            <option value="ready">ready</option>
            <option value="failed">failed</option>
          </select>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className="inline-flex items-center justify-center gap-2 bg-[var(--usus-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--usus-primary-hover)]"
          >
            <Icon name="upload" size={16} />
            Upload documents
          </button>
        </div>

        {/* DOCUMENT TABLE */}

        <div className="overflow-hidden border border-[var(--usus-border)] bg-[var(--usus-surface)]">

          <div className="flex flex-col justify-between gap-2 border-b border-[var(--usus-border)] px-4 py-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                Documents
              </h3>

              <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                {filteredDocuments.length} document(s)
              </p>
            </div>

            {selectedDocument.length > 0 && (
              <button
                type="button"
                onClick={deleteSelected}
                className="inline-flex items-center gap-2 self-start text-xs font-medium text-[var(--usus-danger)] hover:underline sm:self-auto"
              >
                <Icon name="trash" size={15} />
                Delete selected ({selectedDocument.length})
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="px-6 py-16 text-center text-sm text-[var(--usus-text-muted)]">
              Loading documents from the backend...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[var(--usus-surface-soft)] text-[var(--usus-text-muted)]">
                <Icon name="documents" size={27} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[var(--usus-text)]">
                {search
                  ? "No matching documents"
                  : "Your document library is empty"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--usus-text-muted)]">
                {search
                  ? "Try a different search term or change the status filter."
                  : "Upload your organisation's documents, training materials, policies and resources to build your knowledge base."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className="mt-5 inline-flex items-center gap-2 bg-[var(--usus-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--usus-primary-hover)]"
                >
                  <Icon name="upload" size={16} />
                  Upload your first document
                </button>
              )}

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="bg-[var(--usus-surface-soft)]">
                  <tr className="border-b border-[var(--usus-border)]">

                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          filteredDocuments.length > 0 &&
                          selectedDocument.length ===
                          filteredDocuments.length
                        }
                        onChange={toggleAll}
                        aria-label="Select all documents"
                        className="accent-[var(--usus-primary)]"
                      />
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Document
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Type
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Size
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Characters
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Status
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-[var(--usus-text-muted)]">
                      Created
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--usus-text-muted)]">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--usus-border-soft)]">

                  {filteredDocuments.map((document) => (
                    <tr
                      key={document.id}
                      className="transition-colors hover:bg-[var(--usus-surface-soft)]"
                    >

                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocument.includes(
                            document.id,
                          )}
                          onChange={() =>
                            toggleSelected(document.id)
                          }
                          aria-label={`Select ${document.filename}`}
                          className="accent-[var(--usus-primary)]"
                        />
                      </td>

                      <td className="max-w-[280px] px-4 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--usus-surface-soft)] text-[var(--usus-text-muted)]">
                            <Icon name="file" size={18} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-medium text-[var(--usus-text)]"
                              title={document.filename}
                            >
                              {document.filename}
                            </p>

                            <p className="mt-1 text-xs text-[var(--usus-text-soft)]">
                              {document.id.slice(0, 8)}
                            </p>
                            {document.error && (
                              <p className="mt-1 text-xs text-[var(--usus-danger)]" title={document.error}>
                                {document.error}
                              </p>
                            )}
                          </div>

                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-[var(--usus-text-muted)]">
                        {getFileType(document.file_type)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[var(--usus-text-muted)]">
                        {formatFileSize(document.size_bytes)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[var(--usus-text-muted)]">
                        {document.char_count.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={document.status} />
                      </td>

                      <td className="px-4 py-4 text-sm text-[var(--usus-text-muted)]">
                        {formatDate(document.created_at)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDelete(document.id)
                          }
                          className="inline-flex items-center gap-1.5 border border-[var(--usus-border)] px-3 py-2 text-xs font-medium text-[var(--usus-danger)] transition-colors hover:bg-[var(--usus-surface-soft)]"
                        >
                          <Icon name="trash" size={14} />
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
          )}

        </div>

      </div>
    );
  }

  /* ============================================================
     UPLOAD SCREEN
  ============================================================ */

  function renderUpload() {
    return (
      <div className="mx-auto max-w-4xl space-y-6">

        <div>
          <h2 className="text-xl font-semibold text-[var(--usus-text)]">
            Upload Knowledge Base Documents
          </h2>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            Add company documents and training resources to your organisation&apos;s knowledge base.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex min-h-[300px] flex-col items-center justify-center border-2 border-dashed px-6 py-12 text-center transition-colors ${isDragging
              ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
              : "border-[var(--usus-border)] bg-[var(--usus-surface)]"
            }`}
        >

          <div className="flex h-16 w-16 items-center justify-center bg-[var(--usus-surface-soft)] text-[var(--usus-primary)]">
            <Icon name="upload" size={30} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-[var(--usus-text)]">
            Drag and drop your documents here
          </h3>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            or select documents from your computer
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-6 bg-[var(--usus-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--usus-primary-hover)]"
          >
            {isUploading ? "Uploading..." : "Browse files"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedExtensions.join(",")}
            onChange={onFileChange}
            className="hidden"
          />

          <p className="mt-5 text-xs text-[var(--usus-text-soft)]">
            Supported formats: PDF and DOCX. Maximum file size: 20 MB.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">
            <h4 className="text-sm font-semibold text-[var(--usus-text)]">
              What can you upload?
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-[var(--usus-text-muted)]">
              <li>Company policies and procedures</li>
              <li>Training manuals and guides</li>
              <li>Employee handbooks</li>
              <li>Product and service documentation</li>
              <li>Learning and assessment materials</li>
            </ul>
          </div>

          <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">
            <h4 className="text-sm font-semibold text-[var(--usus-text)]">
              Before you upload
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-[var(--usus-text-muted)]">
              <li>Use clear and readable documents.</li>
              <li>Avoid duplicate files.</li>
              <li>Remove unnecessary sensitive information.</li>
              <li>Ensure you have permission to upload the material.</li>
              <li>Check that documents are up to date.</li>
            </ul>
          </div>

        </div>

        {documents.length > 0 && (
          <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--usus-text)]">
                Recently added
              </h3>

              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className="text-xs font-medium text-[var(--usus-primary)]"
              >
                View library
              </button>
            </div>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              {documents.length} document(s) in your knowledge base.
            </p>
          </div>
        )}

      </div>
    );
  }

  /* ============================================================
     SEARCH SCREEN
  ============================================================ */

  function renderSearch() {
    return (
      <div className="space-y-6">

        <div>
          <h2 className="text-xl font-semibold text-[var(--usus-text)]">
            Search Knowledge Base
          </h2>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            Find documents in your organisation&apos;s knowledge library.
          </p>
        </div>

        <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--usus-text-soft)]">
              <Icon name="search" size={20} />
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a document..."
              className="w-full border border-[var(--usus-border)] bg-[var(--usus-background)] py-4 pl-12 pr-4 text-sm text-[var(--usus-text)] outline-none focus:border-[var(--usus-primary)]"
            />
          </div>

          <p className="mt-3 text-xs text-[var(--usus-text-soft)]">
            Search filters the documents returned by the backend by filename. Full-text and semantic search are not available through the current API.
          </p>

        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-[var(--usus-text)]">
            Search results ({filteredDocuments.length})
          </h3>

          {filteredDocuments.length === 0 ? (
            <EmptyState
              title="No documents found"
              description="Try another search term or upload documents to your knowledge base."
            />
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between gap-4 border border-[var(--usus-border)] bg-[var(--usus-surface)] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon name="file" size={20} />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--usus-text)]">
                        {document.filename}
                      </p>

                      <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                        {getFileType(document.file_type)} · {formatFileSize(document.size_bytes)}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={document.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    );
  }

  /* ============================================================
     SETTINGS SCREEN
  ============================================================ */

  function renderSettings() {
    return (
      <div className="max-w-3xl space-y-6">

        <div>
          <h2 className="text-xl font-semibold text-[var(--usus-text)]">
            Knowledge Base Settings
          </h2>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            Configure how your organisation&apos;s documents are managed.
          </p>
        </div>

        <div className="divide-y divide-[var(--usus-border)] border border-[var(--usus-border)] bg-[var(--usus-surface)]">

          <SettingRow
            title="Automatic indexing"
            description="Document processing is handled automatically by the backend. This control is a local preference and is not saved by the API."
            checked={autoIndex}
            onChange={setAutoIndex}
          />

          <SettingRow
            title="Processing notifications"
            description="The current API does not provide notification settings. This control is a local preference only."
            checked={notifyOnCompletion}
            onChange={setNotifyOnCompletion}
          />

        </div>

        <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5">

          <h3 className="font-semibold text-[var(--usus-text)]">
            Storage overview
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-[var(--usus-text-muted)]">
                Total documents
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                {documents.length}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--usus-text-muted)]">
                Total uploaded size
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                {formatFileSize(totalSize)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--usus-text-muted)]">
                Ready documents
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                {readyCount}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--usus-text-muted)]">
                failed documents
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                {failedCount}
              </p>
            </div>

          </div>

          <p className="mt-5 text-xs text-[var(--usus-text-soft)]">
            Storage figures are calculated from the documents returned by the backend.
          </p>

        </div>

      </div>
    );
  }

  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <main className="w-full min-w-0 space-y-6">

      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-medium text-[var(--usus-primary)]">
            Organisation Resources
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
            Knowledge Base
          </h1>

          <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
            Manage your organisation&apos;s documents and training resources.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className="inline-flex items-center justify-center gap-2 self-start bg-[var(--usus-primary)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--usus-primary-hover)] sm:self-auto"
        >
          <Icon name="upload" size={16} />
          Upload documents
        </button>

      </div>

      {pageError && (
        <div className="border border-[var(--usus-danger)] bg-[var(--usus-surface-soft)] px-4 py-3 text-sm text-[var(--usus-danger)]">
          {pageError}
          <button
            type="button"
            onClick={() => setPageError("")}
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <SummaryCard
          label="Total documents"
          value={String(documents.length)}
          icon="documents"
        />

        <SummaryCard
          label="Ready"
          value={String(readyCount)}
          icon="check"
        />

        <SummaryCard
          label="failed"
          value={String(failedCount)}
          icon="alert"
        />

        <SummaryCard
          label="Storage used"
          value={formatFileSize(totalSize)}
          icon="file"
        />

      </section>

      {/* KNOWLEDGE BASE WORKSPACE */}

      <section className="overflow-hidden border border-[var(--usus-border)] bg-[var(--usus-surface)]">

        {/* NAVIGATION TABS */}

        <div className="overflow-x-auto border-b border-[var(--usus-border)]">
          <nav className="flex min-w-max items-center gap-1 px-3 pt-2">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                  setFilter("All");
                }}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${activeTab === tab.id
                    ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] font-semibold text-[var(--usus-primary)]"
                    : "border-transparent text-[var(--usus-text-muted)] hover:bg-[var(--usus-surface-soft)] hover:text-[var(--usus-text)]"
                  }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}

          </nav>
        </div>

        {/* TAB CONTENT */}

        <div className="min-h-[480px] p-4 sm:p-6">

          {activeTab === "documents" &&
            renderDocuments()}

          {activeTab === "upload" &&
            renderUpload()}

          {activeTab === "search" &&
            renderSearch()}

          {activeTab === "recent" &&
            renderDocuments()}

          {activeTab === "manage" &&
            renderDocuments()}

          {activeTab === "settings" &&
            renderSettings()}

        </div>

      </section>

      {/* DELETE CONFIRMATION */}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-md border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--usus-text)]">
                Delete document?
              </h2>

              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="text-[var(--usus-text-muted)] hover:text-[var(--usus-text)]"
                aria-label="Close confirmation"
              >
                <Icon name="close" />
              </button>
            </div>

            <p className="mt-3 text-sm text-[var(--usus-text-muted)]">
              Are you sure you want to permanently delete this document from the knowledge base? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="border border-[var(--usus-border)] px-4 py-2.5 text-sm text-[var(--usus-text)] hover:bg-[var(--usus-surface-soft)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteDocument(confirmDelete)}
                className="bg-[var(--usus-danger)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Delete document
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="border border-[var(--usus-border)] bg-[var(--usus-surface)] p-4 sm:p-5">

      <div className="flex items-center justify-between gap-2">

        <p className="text-xs font-medium text-[var(--usus-text-muted)] sm:text-sm">
          {label}
        </p>

        <span className="text-[var(--usus-primary)]">
          <Icon name={icon} size={18} />
        </span>

      </div>

      <p className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: DocumentStatus;
}) {
  const styles: Record<DocumentStatus, string> = {
    processing:
      "bg-[var(--usus-primary-soft)] text-[var(--usus-text)]",
    ready:
      "bg-[var(--usus-primary-soft)] text-[var(--usus-primary)]",
    failed:
      "bg-[var(--usus-surface-soft)] text-[var(--usus-danger)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-[var(--usus-border)] bg-[var(--usus-surface)] px-6 py-12 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[var(--usus-surface-soft)] text-[var(--usus-text-muted)]">
        <Icon name="documents" size={24} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--usus-text)]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--usus-text-muted)]">
        {description}
      </p>

    </div>
  );
}

/* ============================================================
   SETTINGS ROW
============================================================ */

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 p-5">

      <div>
        <h3 className="text-sm font-semibold text-[var(--usus-text)]">
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--usus-text-muted)]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 transition-colors ${checked
            ? "bg-[var(--usus-primary)]"
            : "bg-[var(--usus-border)]"
          }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 bg-white transition-all ${checked ? "left-6" : "left-1"
            }`}
        />
      </button>

    </div>
  );
}