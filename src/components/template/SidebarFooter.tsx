import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getSessionServer } from '@/features/auth/utils/auth-server';
import { getInitials } from '@/libs/utils';
import { useSession } from 'next-auth/react';

export const SidebarFooterUser = () => {
const { data: session} = useSession();
console.log(session)
  return (
    //      <div className="mt-auto p-4 border-t">
    //     <div className="flex flex-col space-y-3">
    //       <div className="flex items-center">
    //         <Avatar className="h-8 w-8 bg-gray-300">
    //           {userImage && <AvatarImage src={userImage} alt={userName} />}
    //           <AvatarFallback>{initials}</AvatarFallback>
    //         </Avatar>
    //         <div className="ml-2">
    //           <p className="text-sm font-medium">{userName}</p>
    //           <p className="text-xs text-gray-500">{userEmail}</p>
    //         </div>
    //       </div>
          
        
    //     </div>
    //   </div>
    <div>klsjdkl</div>
  )
}
