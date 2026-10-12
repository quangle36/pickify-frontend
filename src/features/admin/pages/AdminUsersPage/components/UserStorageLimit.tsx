import { useEffect, useId, useRef, useState } from 'react';
import { Loader2, Pencil, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { errorMessage } from '@/api/errors';
import { useSetStorageLimit } from '../../../queries/admin.mutations';
import type { AdminUser } from '../../../types/admin.types';
import { formatBytes } from '../../../utils/formatBytes';

const GB = 1024 ** 3;

export function UserStorageLimit({ user }: { user: AdminUser }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(String(user.storageLimitBytes / GB));
  const [editing, setEditing] = useState(false);
  const mutation = useSetStorageLimit();
  const { toast } = useToast();
  useEffect(() => { setValue(String(user.storageLimitBytes / GB)); }, [user.storageLimitBytes]);
  const numericValue = Number(value.replace(',', '.'));
  const bytes = Math.round(numericValue * GB);
  const valid = value.trim() !== '' && numericValue >= 0 && Number.isSafeInteger(bytes) && bytes >= 0;
  const changed = valid && bytes !== user.storageLimitBytes;
  const save = async () => {
    if (!changed || mutation.isPending) return;
    try {
      await mutation.mutateAsync({ id: user.id, bytes });
      setEditing(false);
      toast({ title: 'Đã lưu hạn mức dung lượng', description: user.email });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể lưu hạn mức', description: errorMessage(error) });
    }
  };
  const cancel = () => {
    if (mutation.isPending) return;
    setValue(String(user.storageLimitBytes / GB));
    setEditing(false);
  };
  return <form className="admin-storage-limit" onSubmit={event => { event.preventDefault(); void save(); }}
    onBlur={event => { if (editing && !event.currentTarget.contains(event.relatedTarget)) cancel(); }}
    onKeyDown={event => { if (event.key === 'Escape' && editing) { event.stopPropagation(); cancel(); } }}>
    <div className="admin-storage-limit-line">
      <span>{formatBytes(user.storageBytes)} /</span>
      <div className="admin-storage-limit-input">
        <Input ref={inputRef} id={id} type="text" inputMode="decimal" maxLength={3} readOnly={!editing} tabIndex={editing ? 0 : -1}
          aria-label={`Hạn mức dung lượng (GB) của ${user.email}`} aria-invalid={!valid}
          className={`admin-inline-quota ${editing ? 'is-editing' : ''}`} value={value}
          title={!valid ? 'Nhập dung lượng hợp lệ từ 0 GB.' : undefined}
          disabled={mutation.isPending} onChange={event => setValue(event.target.value)} />
        <span>GB</span>
      </div>
      <TooltipProvider><Tooltip><TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="h-10 w-8 shrink-0"
          disabled={mutation.isPending || (editing && !changed)}
          aria-label={`${editing ? 'Lưu' : 'Sửa'} hạn mức của ${user.email}`}
          onPointerDown={event => { if (editing) event.preventDefault(); }}
          onClick={() => { if (editing) void save(); else { setValue(String(user.storageLimitBytes / GB)); setEditing(true); requestAnimationFrame(() => { inputRef.current?.focus({ preventScroll: true }); inputRef.current?.select(); }); } }}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : editing ? <Save /> : <Pencil />}
        </Button>
      </TooltipTrigger><TooltipContent>{editing ? 'Lưu hạn mức' : 'Sửa hạn mức'}</TooltipContent></Tooltip></TooltipProvider>
    </div>
    {editing && <p className="sr-only" role={!valid ? 'alert' : undefined}>
      {!valid ? 'Nhập dung lượng hợp lệ từ 0 GB.' : changed && bytes < user.storageBytes ? 'Dung lượng đã dùng vượt hạn mức mới.' : ''}
    </p>}
  </form>;
}
