import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";
import { SignInFlow } from "@/app/features/auth/types";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name,setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("两次输入的密码不正确");
      return;
    }
    setPending(true);
    signIn("password", {name ,email, password, flow: "signUp" })
      .catch(() => {
        setError("Somethi g went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  };
  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 p-8">
        <CardTitle>注册后继续</CardTitle>
        <CardDescription>使用您的电子邮件或其他服务继续</CardDescription>
      </CardHeader>
      {!!error && (
        <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm mb-3">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className=" space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
        <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="full name"
            type="text"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            type="password"
            required
          />
          <Button
            type="submit"
            className=" w-full"
            size="lg"
            disabled={pending}
          >
            注册
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            onClick={() => onProviderSignUp("google")}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            使用谷歌注册
          </Button>
          <Button
            disabled={false}
            onClick={() => onProviderSignUp("github")}
            variant="outline"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            使用Github注册
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          已有账号？
          <span
            onClick={() => setState("signin")}
            className=" text-sky-700  hover:underline cursor-pointer"
          >
            点击登录
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
