import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListingForm } from '../components/listings/listing-form';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useCreateListing } from '../hooks/useMarketplace';
import { Button } from '../components/ui/button';

export function PublishPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, mode } = useAuth();
  const createMutation = useCreateListing(user);

  useEffect(() => {
    document.title = '订阅拼车站 | 发布拼车';
  }, []);

  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl space-y-4 p-8 text-center">
        <CardTitle>发布前需要先登录</CardTitle>
        <CardDescription>
          文档要求 Google 登录。当前页面已经接入 Google OAuth；如果还没配置 Supabase，则先进入 demo 登录体验完整提交流程。
        </CardDescription>
        <div className="flex justify-center">
          <Button onClick={() => void signInWithGoogle()}>
            {mode === 'demo' ? '进入 Demo 登录' : 'Google 登录'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="space-y-3 p-8">
        <CardTitle>发布新的拼车信息</CardTitle>
        <CardDescription>
          使用固定枚举字段保证数据质量。提交后会立即出现在首页列表和你的发布页中。
        </CardDescription>
      </Card>

      <Card className="p-8">
        <ListingForm
          defaultContact={user.contact}
          submitLabel="发布拼车"
          isSubmitting={createMutation.isPending}
          onSubmit={async (payload) => {
            await createMutation.mutateAsync(payload);
            navigate('/my-listings');
          }}
        />
      </Card>
    </div>
  );
}
