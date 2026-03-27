import { useState } from 'react';

import { useCreateReport } from '../../hooks/useMarketplace';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

interface ReportDialogProps {
  listingId: string;
}

export function ReportDialog({ listingId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useCreateReport();

  async function handleReport() {
    setMessage(null);

    try {
      await mutation.mutateAsync({ listing_id: listingId, reason });
      setReason('');
      setMessage('举报已记录，后续可以在 Supabase 后台审核。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '提交失败，请稍后重试。');
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        举报信息
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setMessage(null);
        }}
        title="提交举报"
        description="用于处理垃圾信息、虚假车位或不当联系方式。"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={() => void handleReport()} disabled={mutation.isPending}>
              {mutation.isPending ? '提交中...' : '确认举报'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="请简要说明举报原因，例如：联系方式引流、描述与实际不符、重复灌水。"
          />
          {message ? (
            <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-3 text-sm text-ink/70">
              {message}
            </div>
          ) : null}
        </div>
      </Dialog>
    </>
  );
}
