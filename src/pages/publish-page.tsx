import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListingForm } from '../components/listings/listing-form';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useCreateListing } from '../hooks/useMarketplace';
import { Button } from '../components/ui/button';

export function PublishPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const createMutation = useCreateListing(user);

  useEffect(() => {
    document.title = '订阅拼车站 | 发布拼车';
  }, []);

  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl space-y-4 p-8 text-center">
        <CardTitle>发布前需要先登录</CardTitle>
        <CardDescription>登录后即可发布和管理你自己的拼车信息。</CardDescription>
        <div className="flex justify-center">
          <Button onClick={() => void signInWithGoogle()}>Google 登录</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="space-y-3 p-8">
        <CardTitle>发布新的拼车信息</CardTitle>
        <CardDescription>填写地区、产品、价格、车位和联系方式后即可发布。</CardDescription>
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
