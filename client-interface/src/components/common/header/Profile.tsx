import { SkeletonText } from "@components/loading/SkeletonText";
import { useUserContext } from "@context/UserContext";
import Image from "next/image";

export const Profile: React.FunctionComponent = () => {
    const { user } = useUserContext();

    if (user) {
        return (
            <div className="flex gap-3 cursor-pointer text-coral-400 hover:underline">
                <div className="rounded-full overflow-hidden p-1 bg-white">
                    <Image alt={"pfp"} src={user.pfp} width={28} height={28} />
                </div>
                <button>@{user.name}</button>
            </div>
        );
    } else {
        return <SkeletonText textLength={10} />;
    }
};
