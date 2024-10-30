import { useAuthActions } from "@convex-dev/auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { SignInFlow } from "../types";
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}
export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const onPasswordSigIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", {email, password, flow: "signIn" })
      .catch(() => {
        setError("输入的账号密码不存在");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProviderSignin = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 p-8">
        <CardTitle>登录后继续</CardTitle>
        <CardDescription>使用您的电子邮件或其他服务继续</CardDescription>
      </CardHeader>
      {!!error && (
        <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm mb-3">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className=" space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSigIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            type="password"
            required
          />
          <Button
            type="submit"
            className=" w-full"
            size="lg"
            disabled={pending}
          >
            登录
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => {
              onProviderSignin("google");
            }}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            使用谷歌登录
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              onProviderSignin("github");
            }}
            variant="outline"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            使用Github登录
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          没有账号？
          <span
            onClick={() => setState("signup")}
            className=" text-sky-700  hover:underline cursor-pointer"
          >
            点击注册
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
