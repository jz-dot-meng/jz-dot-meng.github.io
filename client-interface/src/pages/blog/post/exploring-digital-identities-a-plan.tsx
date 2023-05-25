import { BlogWrapper } from "@components/blog/BlogWrapper";
import { posts } from "@constants";
import Link from "next/link";
import React from "react";

const post_230523: React.FunctionComponent = () => {
    const EXPLORING_DIGITAL_IDENTITIES = posts["exploring-digital-identities-a-plan"];
    return (
        <BlogWrapper data={EXPLORING_DIGITAL_IDENTITIES}>
            <i>
                This post serves as both a preamble and outline of a three-part plan, and a means to
                hold myself accountable for executing on said plan. Given that I work full-time as a
                freelance/contractor software dev, I'll allow myself the concession of not setting
                concrete timeframes, but here goes:
            </i>
            <p>
                Recently I have been reading and watching a lot of videos about{" "}
                <Link href={"https://www.youtube.com/watch?v=RCJdPiogUIk"} target="_blank">
                    hacking
                </Link>
                ,{" "}
                <Link href={"https://github.com/0xJuancito/multichain-auditor"} target="_blank">
                    penetration testing/security auditing
                </Link>{" "}
                and{" "}
                <Link
                    href={
                        "https://salt.security/blog/a-new-oauth-vulnerability-that-may-impact-hundreds-of-online-services"
                    }
                    target="_blank"
                >
                    post-hack vulnerability breakdowns
                </Link>
                . This interest was born from the 'hacker'-esque mindset embraced by the current
                startup that I'm working at, fostered by the genius whizz of a software dev that I
                count lucky to call my colleague - as part of the 'build fast, iterate better'
                mentality, there's a lot of reverse-engineering API calls, and scraping off services
                that don't secure their database behind (standard?) security protocols (so we don't
                need to devote dev time to roll our own modules and infrastructure in order to
                manually index the same publicly-available data, not for nefarious reasons!).
            </p>
            <p>
                Tangentially, this has also meant touching on cryptography, and trying to understand
                (at least on a surface level, if not more in depth) for example the steps involved
                from start to end how your computer reaches out to a server, and how the two{" "}
                <Link href={"https://tls13.xargs.org/#client-key-exchange-generation"}>
                    complete a handshake
                </Link>{" "}
                to generate a shared key with which data can be encrypted on one end and decrypted
                on the other.
            </p>
            <p>
                This led to the following idea - what better way to learn more about the processes
                involved, than to build something of my own that implements it? Now I know, the
                first rule (if there were any) in the cryptography community is for non-specialists
                to NOT run their own implementation of existing cryptographic protocols, which makes
                complete sense! And so where ever possible, I'll seek to use open source
                cryptography libraries, and also make very apparent that this is something I've
                built on my own, mainly for learning and novelty purposes, and not intended for
                anything secure.
            </p>
            <p>That being said, here's the plan:</p>
            <h2>part 1: pseudonymous identities</h2>
            <i>goal: allow visitors to the site to generate a pseudonymous identity</i>
            <p>
                brief: visitors will be able opt in to creating + registering a pseudonymous
                identity, which will allow them to leave music suggestions on my{" "}
                <Link href={"/music/recently-listened"}>music page</Link>, drop their high score on
                a leaderboard on each of my <Link href={"/minigame/memory"}>minigames</Link>, and
                maybe even leave comments on these blog posts.
            </p>
            <p>
                technical: there'll be no need to sign-in to any third party service (Facebook,
                Google, etc.) - a private key will be generated for the public identity, and will be
                stored in the web browser's local storage, with the option to export (should anyone
                feel strongly enough to maintain the same identity across different
                browsers/devices). Storage of public identifiers, leaderboard and
                comments/suggestions in plain-text will initially be Google's{" "}
                <Link href={"https://firebase.google.com/"}>Firebase</Link>, simply because I am
                familiar with the workflow to be able to get something up and running quickly
            </p>
            <h2>part 2: private messaging</h2>
            <i>goal: allow two visitors to instantiate a private messaging channel</i>
            <p>
                brief: a registered identity can view other registered identities on this site, and
                request to connect with one to exchange private messages. on a semi-technical note,
                these messages will be stored in its encrypted form in Firebase storage, and should
                only be able to be decrypted locally in-browser by the two identities via their
                private keys.
            </p>
            <p>
                tehcnical: a whole lot more research on my part needs to go into this: I only
                understand on a high level how ECDH works{" "}
                <i>just so two users can agree on a shared key</i>, without even considering how to
                use that shared key to encrypt messages. The idea is that the server (and any other
                malicious actors listening in) can see the two public identities and see the shared
                key they agreed on, but without the private key shouldn't be able to do much with
                that information to reveal the messages themselves, since it would be
                computationally 'impossible' to decrypt them through brute force. Of course, other
                information can be leaked (i.e. time when the user sends the message, message length
                maybe?), but at this moment it's beyond the scope of what I'm looking to achieve.
            </p>
            <h2>part 3: self-hosted?</h2>
            <i>goal: move away from a centralised store of data</i>
            <p>brief: allow the user to self-custody their messages</p>
            <p>
                technical: ??? (see <Link href={"https://simplex.chat/"}>SimpleX chat</Link> as a
                possible implementation to draw inspiration from)
            </p>
            <p>
                While building this out, I'll try to be as open-source as possible with the
                implementation, including (if possible) the Firebase implementation, without leaking
                my own private API keys left and right.
            </p>
        </BlogWrapper>
    );
};

export default post_230523;
