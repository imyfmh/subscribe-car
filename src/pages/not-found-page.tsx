import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';

export function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-2xl space-y-4 p-8 text-center">
      <CardTitle>页面不存在</CardTitle>
      <CardDescription>请检查路径，或者回到首页继续浏览订阅拼车信息。</CardDescription>
      <div className="flex justify-center">
        <Link to="/">
          <Button>回到首页</Button>
        </Link>
      </div>
    </Card>
  );
}
