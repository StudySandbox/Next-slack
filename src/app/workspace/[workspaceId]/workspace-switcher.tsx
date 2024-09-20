import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  // 언더바를 붙이면 VSCode에서 사용하고 있는 것 처럼 표시됩니다
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative size-9 overflow-hidden bg-[#ABABAD] text-xl font-semibold text-slate-800 hover:bg-[#ABABAD]/80">
            {workspaceLoading ? (
              <Loader className="size-5 shrink-0 animate-spin" />
            ) : (
              workspace?.name.charAt(0).toUpperCase()
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className="cursor-pointer flex-col items-start justify-start capitalize"
          >
            {workspace?.name}
            <span className="text-xs text-muted-foreground">
              Active workspace
            </span>
          </DropdownMenuItem>
          {filteredWorkspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace._id}
              onClick={() => router.push(`/workspace/${workspace._id}`)}
              className="cursor-pointer capitalize"
            >
              <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-lg font-semibold text-white">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <p className="truncate">{workspace.name}</p>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#F2F2F2] text-lg font-semibold text-slate-800">
              <Plus />
            </div>
            Create a new workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
