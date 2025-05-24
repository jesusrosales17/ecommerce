import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/libs/utils";
import { useSession } from "next-auth/react";

export const SidebarFooterUser = () => {
  const { data: session } = useSession();
  const name = session?.user.name;
  const email = session?.user.email;
  const image = session?.user.image;
  const initials = getInitials(name || "");
  return (
    <div className="mt-auto p-4 border-t">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          {
            image ? (
              <Avatar className="h-8 w-8 bg-gray-300">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 bg-gray-300">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            )
          }
        
          <div className="ml-2">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
