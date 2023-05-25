import Link from "next/link";
import { useEffect, useState } from "react";

//components
import { CliffordAttractor } from "@components/canvas-animations/CliffordAttractor";
import { ParticleField } from "@components/canvas-animations/ParticleField";
import { LeftRightSelect } from "@components/common/selections/LeftRightSelect";
import { SkeletonText } from "@components/loading/SkeletonText";
import { HorizontalLinks } from "@components/navigation/HorizontalLinks";

//types
import { HorizontalLinkType } from "../utils/types/navigation";

function Landing() {
    const animations = ["Particle field", "Clifford Attractor"];

    const [latestCommit, setLatestCommit] = useState<string>("");

    const [selectedAnim, setSelectedAnim] = useState<number>(0);

    const [dynamicFade, setDynamicFade] = useState<string>("");

    /**
     * On initial load
     */
    useEffect(() => {
        /**
         * Get github latest branch commit to jz-dot-meng.github.io
         */
        async function getLatestCommit() {
            try {
                const response = await fetch(
                    "https://api.github.com/repos/jz-dot-meng/jz-dot-meng.github.io/git/refs/heads/main",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const json = await response.json();
                let shaSlice = json["object"]["sha"].slice(0, 6);
                setLatestCommit(shaSlice);
            } catch (err) {
                console.warn(err);
            }
        }
        getLatestCommit();
        setTimeout(() => setDynamicFade("fadeout-5sec"), 1000);
    }, []);

    const links: HorizontalLinkType[] = [
        {
            url: "https://github.com/jz-dot-meng",
            name: "Github",
        },
        {
            url: "https://www.instagram.com/meng_beats/",
            name: "Instagram",
        },
        {
            url: "https://twitter.com/jz_dot_meng/",
            name: "Twitter",
        },
    ];

    const handleSelectionChange = (newSelection: number) => {
        setSelectedAnim(newSelection);
    };

    /**
     * Handle mouse over canvas, show selection tool
     */
    const handleMouseOverDisplay = () => {
        setDynamicFade("");
    };
    /**
     * Handle mouse leave canvas, fade out selection tool
     */
    const handleMouseLeaveFade = () => {
        setDynamicFade("fadeout-5sec");
    };

    return (
        <div className="flex h-full flex-col gap-4 p-8">
            <div
                className={`relative h-3/5`}
                onMouseOver={handleMouseOverDisplay}
                onMouseLeave={handleMouseLeaveFade}
            >
                {selectedAnim === 0 && <ParticleField />}
                {selectedAnim === 1 && <CliffordAttractor />}
                <div className={`absolute right-0 bottom-0 ${dynamicFade}`}>
                    <LeftRightSelect
                        options={animations}
                        selection={selectedAnim}
                        onChange={handleSelectionChange}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                    <h4>@jz-dot-meng</h4>
                    <h1 className="font-display font-bold">jz.meng</h1>
                    <div>
                        <HorizontalLinks linkMap={links} />
                    </div>
                </section>
                <section className="flex flex-col gap-2 text-sm">
                    <div>
                        <Link href="/minigame/memory">Software developer</Link>, occasional{" "}
                        <Link href={"/music/recently-listened"}>
                            sound engineer and music producer
                        </Link>
                    </div>
                    <div>
                        Avid home cook, learner of languages (and{" "}
                        <Link href={"/blog"}>
                            whatever happens to be of interest to me in the moment
                        </Link>
                        !)
                    </div>
                </section>
                <section className="border-t border-white-600 py-4 text-sm">
                    <div>
                        {latestCommit ? (
                            <a href="https://github.com/jz-dot-meng/jz-dot-meng.github.io">
                                {latestCommit}
                            </a>
                        ) : (
                            <SkeletonText
                                textLength={7}
                                href="https://github.com/jz-dot-meng/jz-dot-meng.github.io"
                            />
                        )}
                        <span> :: check out the latest branch commit </span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Landing;
