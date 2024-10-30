import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
type RequestType = { id:Id<"workspaces">,name: string };
type ResponseType = Id<"workspaces"> | null;
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  thorwError?: boolean;
};
export const useUpdateWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  //   const [isPending, setIsPending] = useState(false);
  //   const [isError, setIsError] = useState(false);
  //   const [isSuccess, setIsSuccess] = useState(false);
  //   const [isSettled, setIsSettled] = useState(false);

  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);
  const isPending = useMemo(() => status === "pending",[status])
  const mutation = useMutation(api.workspaces.update);
  //   发送数据并自己封装
  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending")
        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options.thorwError) {
          throw error;
        }
      } finally {
        setStatus("settled")
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return {
    mutate,
    data,
    error,
    isPending,
    isSettled,
    isSuccess,
    isError,
  };
};
