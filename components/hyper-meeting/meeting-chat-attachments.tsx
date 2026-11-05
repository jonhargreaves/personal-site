import { LucideFileText, LucideX } from "@/vendor/hyper-ui/icons";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/vendor/hyper-ui/ui/components/attachment";

function download(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MeetingChatAttachments({ files, onRemove }: { files: readonly File[]; onRemove?: (index: number) => void }) {
  return files.length ? (
    <AttachmentGroup aria-label={onRemove ? "Attached files" : "Message attachments"} role="list">
      {files.map((file, index) => (
        <Attachment key={`${file.name}-${file.lastModified}-${index}`} size="sm" className="max-w-full rounded-[8px]" role="listitem">
          {!onRemove ? <AttachmentTrigger aria-label={`Download ${file.name}`} onClick={() => download(file)} /> : null}
          <AttachmentMedia><LucideFileText className="size-4" /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.size < 1000 ? `${file.size} B` : `${(file.size / 1000).toFixed(1)} KB`}</AttachmentDescription>
          </AttachmentContent>
          {onRemove ? <AttachmentActions><AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => onRemove(index)}><LucideX className="size-4" /></AttachmentAction></AttachmentActions> : null}
        </Attachment>
      ))}
    </AttachmentGroup>
  ) : null;
}
