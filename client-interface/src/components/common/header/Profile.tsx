import { SkeletonText } from "@components/loading/SkeletonText";
import { useUserContext } from "@context/UserContext";
import Image from "next/image";
import Link from "next/link";

export const Profile: React.FunctionComponent = () => {
    const { user } = useUserContext();

    if (user) {
        return (
            <Link
                className="flex items-center gap-3 cursor-pointer text-coral-400 hover:underline"
                href={"/profile/view"}
            >
                <section className="rounded-full overflow-hidden p-1 bg-white">
                    <Image alt={"pfp"} src={user.pfp} width={24} height={24} />
                </section>
                <section>@{user.name}</section>
            </Link>
        );
    } else {
        return <SkeletonText textLength={10} />;
    }
};
