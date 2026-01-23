"use client";

import { nanoid } from "nanoid";
import { track } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LanguageType, RegistryType } from "./registry-pastebin";

interface FileInput {
  id: string;
  code: string;
  fileName: string;
  language: LanguageType;
  registryType: RegistryType;
}

interface DraftData {
  files: FileInput[];
  snippetName: string;
}

interface ClearDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileCount: number;
  onClearDraft: () => void;
  onResetDraftData: (data: DraftData) => void;
}

export function ClearDraftDialog({
  open,
  onOpenChange,
  fileCount,
  onClearDraft,
  onResetDraftData,
}: ClearDraftDialogProps) {
  const handleClearDraft = () => {
    onClearDraft();
    onResetDraftData({
      files: [
        {
          id: nanoid(),
          code: "",
          fileName: "",
          language: "plaintext",
          registryType: "file",
        },
      ],
      snippetName: "",
    });
    track("draft_cleared", { file_count: fileCount });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Clear draft?</DialogTitle>
          <DialogDescription className="pt-1">
            This will reset all {fileCount > 1 ? `${fileCount} files` : "field"}
            {fileCount > 1 ? "" : "s"} and remove your saved draft. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearDraft}
            className="flex-1 sm:flex-initial"
          >
            Clear Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
