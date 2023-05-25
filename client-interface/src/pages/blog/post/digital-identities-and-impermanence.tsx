import { BlogWrapper } from "@components/blog/BlogWrapper";
import { posts } from "@constants";
import Link from "next/link";

const post_230521: React.FunctionComponent = () => {
    const DIGITAL_PERMANENCE = posts["digital-identities-and-impermanence"];
    return (
        <BlogWrapper data={DIGITAL_PERMANENCE}>
            <p>
                Three days ago (from the date of drafting), the video hosting giant Gfycat, best
                known for their semi-eponymous short-form videos, failed to renew their domain name.
                As a result, its entire hosted database of gifs simply vanished from the internet,
                at least in its accessible form. Users who had, over the years, built a library of
                their own creations, were suddenly no longer in possession of their work if they had
                not backed up their gifs and videos in an alternative storage. A few days before
                that, Youtube announced that it would be deleting accounts that had been inactive
                for over two years. They had to come out later to{" "}
                <Link href="https://techcrunch.com/2023/05/18/youtube-will-no-longer-be-deleting-videos-from-inactive-accounts/">
                    specify that only accounts with no uploaded videos
                </Link>{" "}
                would be deleted, after community outrage that videos by users who had passed might
                be affected, and the digital memento of their life erased as a result.
            </p>
            <p>
                The nature of digital impermanence seems at odds to the popular conception that
                anything on the internet lasts forever - the saying belies a hidden condition, that
                anything on the internet lasts{" "}
                <i>as long as the infrastructure supporting it remains in place</i>. Maybe a service
                is not renewed or abandoned, like with Gfycat. Maybe it starts charging a fee, and
                pushes the user off their platform. Or maybe such excess of digital data
                necessitates a purge, and an account might unwittingly get caught in it.
            </p>
            <p>
                As such, crafting an online identity implicitly subscribes to this pre-condition:
                this identity that I create exists so long as I tend to its continued persistence,
                and the infrastructure that underpin its hosting and storage are upheld. From the
                laptops that hold the code in local git repositories, to the{" "}
                <Link href="https://github.com/jz-dot-meng/jz-dot-meng.github.io">Github repo</Link>{" "}
                that stores it in the cloud (that have their physical home{" "}
                <Link href="https://github.blog/2017-10-12-evolution-of-our-data-centers/">
                    in the US
                </Link>
                ), and the hosting services that store the latest copy and deploy the code as this
                website (<Link href="https://jz-dot-meng.github.io">Github Pages</Link> and{" "}
                <Link href="https://jz-dot-meng.vercel.app">Vercel</Link>), each link is another
                distributed point where my ideas live online, until it doesn't.
            </p>
            <h2>embracing impermanence</h2>
            <p>
                Take a look into the{" "}
                <Link href="https://github.com/jz-dot-meng/jz-dot-meng.github.io/commits/main">
                    commit history
                </Link>{" "}
                of this website, and you'll quickly see that it's gone through a couple of
                iterations already - from a purely HTML/JS/CSS implementation, to a React.js one to
                this current Next.js framework. The code that represents this site right now is a
                marker of this particular point in time, indicative of my current coding skill, and
                my current thought processes.
            </p>
            <p>
                In saying that, future me will undoubtedly rewrite bits of the code and rephrase
                these sentences to best represent the me at that future moment in time. Sure, the
                git version control will maintain a copy of this particular moment in time in
                perpertuity as a commit, but the live website exists as impermanent moments in time.
            </p>
            <p>
                I might be doxxing my age by saying that I never used MySpace, but this is how I
                imagine it would have been like. Welcome to my small corner of the internet, I hope
                you find something useful here.
            </p>
        </BlogWrapper>
    );
};

export default post_230521;
